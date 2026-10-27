// ====================================================================
// SUCELSO TECH - Controlador de Horários, Algoritmo e Publicação
// ====================================================================

const mockStore = require('../config/mockData');
const supabase = require('../config/supabase');
const { generateSchedule } = require('../services/schedulerService');
const { detectConflicts } = require('../services/conflictService');
const { calculateRoomOccupancy } = require('../services/occupancyService');
const { recordAudit } = require('../services/auditService');

/**
 * Função utilitária para enriquecer slots de horário com nomes descritivos
 */
function enrichScheduleItem(item) {
  const turma = mockStore.turmas.find(t => t.id === item.turma_id);
  const disc = mockStore.disciplinas.find(d => d.id === item.disciplina_id);
  const prof = mockStore.professores.find(p => p.id === item.professor_id);
  const sala = mockStore.salas.find(s => s.id === item.sala_id);

  return {
    ...item,
    turma_nome: turma ? turma.nome : item.turma_nome || 'Turma',
    turma_turno: turma ? turma.turno : 'matutino',
    disciplina_nome: disc ? disc.nome : item.disciplina_nome || 'Disciplina',
    disciplina_codigo: disc ? disc.codigo : item.disciplina_codigo || '',
    professor_nome: prof ? prof.nome : item.professor_nome || 'Docente',
    sala_identificacao: sala ? sala.identificacao : item.sala_identificacao || 'Sala',
    sala_capacidade: sala ? sala.capacidade : 30
  };
}

// 1. GET /api/horarios/minha-turma (Obrigatório)
async function getMinhaTurma(req, res, next) {
  try {
    const user = req.user;
    let targetTurmaId = req.query.turma_id;

    if (user.perfil === 'aluno') {
      targetTurmaId = user.turma_id;
    }

    if (!targetTurmaId) {
      // Se não especificado (ex: coordenador consultando), seleciona a primeira turma
      targetTurmaId = mockStore.turmas[0]?.id;
    }

    // Regra: Alunos visualizam apenas grades homologadas e publicadas
    let versoesPermitidas;
    if (user.perfil === 'aluno') {
      versoesPermitidas = mockStore.versoes_horario
        .filter(v => v.status === 'publicada')
        .map(v => v.id);
    } else {
      // Coordenador e professor podem ver a versão mais recente (publicada ou em revisão)
      versoesPermitidas = mockStore.versoes_horario.map(v => v.id);
    }

    // Filtrar horários
    const horariosFiltrados = mockStore.horarios
      .filter(h => h.turma_id === targetTurmaId && versoesPermitidas.includes(h.versao_id))
      .map(enrichScheduleItem);

    const turmaInfo = mockStore.turmas.find(t => t.id === targetTurmaId);
    const versaoAtual = mockStore.versoes_horario.find(v => versoesPermitidas.includes(v.id));

    return res.status(200).json({
      success: true,
      turma: turmaInfo || null,
      versao: versaoAtual || null,
      horarios: horariosFiltrados
    });
  } catch (err) {
    next(err);
  }
}

// 2. GET /api/horarios/professor (Obrigatório)
async function getHorarioProfessor(req, res, next) {
  try {
    const user = req.user;
    let targetProfId = req.query.professor_id;

    if (user.perfil === 'professor') {
      targetProfId = user.professor_id;
    }

    if (!targetProfId) {
      targetProfId = mockStore.professores[0]?.id;
    }

    let versoesPermitidas = mockStore.versoes_horario.map(v => v.id);
    if (user.perfil === 'aluno') {
      versoesPermitidas = mockStore.versoes_horario
        .filter(v => v.status === 'publicada')
        .map(v => v.id);
    }

    const horariosFiltrados = mockStore.horarios
      .filter(h => h.professor_id === targetProfId && versoesPermitidas.includes(h.versao_id))
      .map(enrichScheduleItem);

    const professorInfo = mockStore.professores.find(p => p.id === targetProfId);

    return res.status(200).json({
      success: true,
      professor: professorInfo || null,
      horarios: horariosFiltrados
    });
  } catch (err) {
    next(err);
  }
}

// 3. GET /api/horarios/todos (Coordenador ou consulta geral)
async function getTodosHorarios(req, res, next) {
  try {
    const { turma_id, professor_id, sala_id, versao_id } = req.query;

    let resultado = [...mockStore.horarios];

    if (versao_id) {
      resultado = resultado.filter(h => h.versao_id === versao_id);
    } else {
      // Por padrão retorna a versão publicada ou a mais recente
      const versaoAtiva = mockStore.versoes_horario.find(v => v.status === 'publicada') || mockStore.versoes_horario[0];
      if (versaoAtiva) {
        resultado = resultado.filter(h => h.versao_id === versaoAtiva.id);
      }
    }

    if (turma_id) resultado = resultado.filter(h => h.turma_id === turma_id);
    if (professor_id) resultado = resultado.filter(h => h.professor_id === professor_id);
    if (sala_id) resultado = resultado.filter(h => h.sala_id === sala_id);

    return res.status(200).json({
      success: true,
      total: resultado.length,
      horarios: resultado.map(enrichScheduleItem)
    });
  } catch (err) {
    next(err);
  }
}

// 4. POST /api/horarios/gerar (Obrigatório - Coordenador)
async function gerarProposta(req, res, next) {
  try {
    const user = req.user;
    const { periodo = '2026.1', observacoes } = req.body;

    // Criar nova versão em status 'rascunho'
    const novaVersaoId = `versao-${Date.now()}`;
    const novaVersao = {
      id: novaVersaoId,
      periodo,
      status: 'rascunho',
      data: new Date().toISOString(),
      responsavel: user.id,
      observacoes: observacoes || 'Proposta de grade gerada automaticamente pelo algoritmo inteligente'
    };

    // Executar algoritmo inteligente com CSP + Heurística MRV + Gap Reduction
    const resultado = generateSchedule({
      turmas: mockStore.turmas,
      disciplinas: mockStore.disciplinas,
      professores: mockStore.professores,
      salas: mockStore.salas,
      disponibilidades: mockStore.disponibilidades.filter(d => d.status === 'aprovado'),
      turma_disciplinas: mockStore.turma_disciplinas,
      versao_id: novaVersaoId,
      periodo
    });

    // Inserir a nova versão e alocações no repositório
    mockStore.versoes_horario.unshift(novaVersao);
    mockStore.horarios = [
      ...resultado.grade_gerada,
      ...mockStore.horarios.filter(h => h.versao_id !== novaVersaoId)
    ];

    // Registrar no histórico de auditoria
    await recordAudit(user.id, 'GERAR_PROPOSTA_GRADE', {
      versao_id: novaVersaoId,
      periodo,
      total_aulas_alocadas: resultado.grade_gerada.length,
      conflitos_detectados: resultado.conflitos.length,
      aulas_nao_alocadas: resultado.aulas_nao_alocadas.length,
      metricas: resultado.metricas
    });

    return res.status(201).json({
      success: true,
      message: 'Proposta de grade horária gerada com sucesso!',
      versao: novaVersao,
      metricas: resultado.metricas,
      conflitos: resultado.conflitos,
      aulas_nao_alocadas: resultado.aulas_nao_alocadas,
      grade_gerada: resultado.grade_gerada.map(enrichScheduleItem)
    });
  } catch (err) {
    next(err);
  }
}

// 5. PUT /api/horarios/:id (Obrigatório - Coordenador)
async function updateHorario(req, res, next) {
  try {
    const user = req.user;
    const { id } = req.params;
    const { sala_id, dia, inicio, fim, professor_id, disciplina_id } = req.body;

    const index = mockStore.horarios.findIndex(h => h.id === id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Horário/slot não encontrado.'
      });
    }

    const itemAntigo = { ...mockStore.horarios[index] };

    // Atualizar dados
    mockStore.horarios[index] = {
      ...itemAntigo,
      sala_id: sala_id || itemAntigo.sala_id,
      dia: dia ? dia.toLowerCase() : itemAntigo.dia,
      inicio: inicio || itemAntigo.inicio,
      fim: fim || itemAntigo.fim,
      professor_id: professor_id || itemAntigo.professor_id,
      disciplina_id: disciplina_id || itemAntigo.disciplina_id
    };

    const itemAtualizado = enrichScheduleItem(mockStore.horarios[index]);

    // Verificar se a alteração introduziu conflitos
    const versaoHorarios = mockStore.horarios.filter(h => h.versao_id === itemAtualizado.versao_id);
    const conflitos = detectConflicts(versaoHorarios, {
      disponibilidades: mockStore.disponibilidades,
      salas: mockStore.salas,
      professores: mockStore.professores,
      turmas: mockStore.turmas,
      disciplinas: mockStore.disciplinas
    });

    // Gravar auditoria
    await recordAudit(user.id, 'ALTERAR_ALOCACAO_HORARIO', {
      horario_id: id,
      antes: itemAntigo,
      depois: itemAtualizado,
      conflitos_pos_alteracao: conflitos.length
    });

    return res.status(200).json({
      success: true,
      message: 'Alocação ajustada com sucesso.',
      horario: itemAtualizado,
      conflitos
    });
  } catch (err) {
    next(err);
  }
}

// 6. POST /api/horarios/versoes/:id/publicar (Obrigatório - Coordenador)
async function publicarVersao(req, res, next) {
  try {
    const user = req.user;
    const { id } = req.params;

    const versao = mockStore.versoes_horario.find(v => v.id === id);
    if (!versao) {
      return res.status(404).json({
        success: false,
        message: 'Versão de grade não encontrada.'
      });
    }

    const statusAnterior = versao.status;

    // Atualiza outras versões do mesmo período para 'em_revisao' para garantir apenas uma versão 'publicada'
    mockStore.versoes_horario.forEach(v => {
      if (v.periodo === versao.periodo && v.id !== id && v.status === 'publicada') {
        v.status = 'em_revisao';
      }
    });

    // Define esta como homologada e publicada
    versao.status = 'publicada';
    versao.data = new Date().toISOString();
    versao.responsavel = user.id;

    // Registrar no histórico de auditoria
    await recordAudit(user.id, 'PUBLICAR_GRADE_OFICIAL', {
      versao_id: id,
      periodo: versao.periodo,
      status_anterior: statusAnterior,
      novo_status: 'publicada'
    });

    return res.status(200).json({
      success: true,
      message: `Versão da grade ${versao.periodo} homologada e publicada com sucesso! Agora é a versão oficial visível para todos os alunos e professores.`,
      versao
    });
  } catch (err) {
    next(err);
  }
}

// 7. GET /api/horarios/conflitos (Obrigatório)
async function getConflitos(req, res, next) {
  try {
    const { versao_id } = req.query;

    let targetHorarios = mockStore.horarios;
    if (versao_id) {
      targetHorarios = targetHorarios.filter(h => h.versao_id === versao_id);
    } else {
      const versaoPublicada = mockStore.versoes_horario.find(v => v.status === 'publicada') || mockStore.versoes_horario[0];
      if (versaoPublicada) {
        targetHorarios = targetHorarios.filter(h => h.versao_id === versaoPublicada.id);
      }
    }

    const conflitos = detectConflicts(targetHorarios, {
      disponibilidades: mockStore.disponibilidades,
      salas: mockStore.salas,
      professores: mockStore.professores,
      turmas: mockStore.turmas,
      disciplinas: mockStore.disciplinas
    });

    return res.status(200).json({
      success: true,
      total_conflitos: conflitos.length,
      grade_sem_conflitos: conflitos.length === 0,
      conflitos
    });
  } catch (err) {
    next(err);
  }
}

// 8. GET /api/horarios/ocupacao-salas (Diferencial de Excelência)
async function getOcupacaoSalas(req, res, next) {
  try {
    const { versao_id } = req.query;

    let targetHorarios = mockStore.horarios;
    if (versao_id) {
      targetHorarios = targetHorarios.filter(h => h.versao_id === versao_id);
    } else {
      const versaoAtiva = mockStore.versoes_horario.find(v => v.status === 'publicada') || mockStore.versoes_horario[0];
      if (versaoAtiva) {
        targetHorarios = targetHorarios.filter(h => h.versao_id === versaoAtiva.id);
      }
    }

    const resultado = calculateRoomOccupancy(mockStore.salas, targetHorarios);

    return res.status(200).json({
      success: true,
      ocupacao: resultado
    });
  } catch (err) {
    next(err);
  }
}

// 9. GET /api/horarios/versoes
async function getVersoes(req, res, next) {
  try {
    const user = req.user;
    let versoes = mockStore.versoes_horario;

    if (user.perfil === 'aluno') {
      versoes = versoes.filter(v => v.status === 'publicada');
    }

    return res.status(200).json({
      success: true,
      versoes
    });
  } catch (err) {
    next(err);
  }
}

// 10. GET /api/horarios/historico (Coordenador)
async function getHistorico(req, res, next) {
  try {
    return res.status(200).json({
      success: true,
      historico: mockStore.historico_alteracoes
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getMinhaTurma,
  getHorarioProfessor,
  getTodosHorarios,
  gerarProposta,
  updateHorario,
  publicarVersao,
  getConflitos,
  getOcupacaoSalas,
  getVersoes,
  getHistorico
};

