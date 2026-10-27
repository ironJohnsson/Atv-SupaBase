// ====================================================================
// SUCELSO TECH - Controlador de Disponibilidades Docentes
// ====================================================================

const mockStore = require('../config/mockData');
const supabase = require('../config/supabase');
const { recordAudit } = require('../services/auditService');

// GET /api/disponibilidades
async function getDisponibilidades(req, res, next) {
  try {
    const user = req.user;
    let targetProfessorId = req.query.professor_id;

    // Se o usuário for professor e não informar query, busca as dele
    if (user.perfil === 'professor' && !targetProfessorId) {
      targetProfessorId = user.professor_id;
    }

    let result = mockStore.disponibilidades;

    if (targetProfessorId) {
      result = result.filter(d => d.professor_id === targetProfessorId);
    }

    return res.status(200).json({
      success: true,
      disponibilidades: result
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/disponibilidades (Obrigatório)
async function createDisponibilidade(req, res, next) {
  try {
    const user = req.user;
    const { dia, inicio, fim } = req.body;
    let professor_id = req.body.professor_id;

    // Aluno não pode registrar
    if (user.perfil === 'aluno') {
      return res.status(403).json({
        success: false,
        message: 'Alunos não possuem permissão para registrar disponibilidades.'
      });
    }

    // Professor só pode registrar para si mesmo
    if (user.perfil === 'professor') {
      professor_id = user.professor_id;
    }

    if (!dia || !inicio || !fim || !professor_id) {
      return res.status(400).json({
        success: false,
        message: 'Os campos professor_id, dia, inicio e fim são obrigatórios.'
      });
    }

    // REGRA DE NEGÓCIO ESSENCIAL:
    // "depois da publicação, mudanças devem ser submetidas ao coordenador, sem alterar automaticamente a grade oficial."
    const gradePublicadaExiste = mockStore.versoes_horario.some(v => v.status === 'publicada');
    const statusAtribuido = (gradePublicadaExiste && user.perfil === 'professor')
      ? 'pendente_aprovacao'
      : 'aprovado';

    const novaDisp = {
      id: `disp-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      professor_id,
      dia: dia.toLowerCase(),
      inicio,
      fim,
      status: statusAtribuido,
      criado_em: new Date().toISOString()
    };

    mockStore.disponibilidades.push(novaDisp);

    await recordAudit(user.id, 'REGISTRAR_DISPONIBILIDADE', {
      ...novaDisp,
      grade_publicada_vigente: gradePublicadaExiste,
      mensagem: statusAtribuido === 'pendente_aprovacao'
        ? 'Submetido após homologação da grade; aguardando validação do coordenador.'
        : 'Disponibilidade ativa e considerada no algoritmo.'
    });

    return res.status(201).json({
      success: true,
      message: statusAtribuido === 'pendente_aprovacao'
        ? 'Disponibilidade registrada como pendente de análise pela coordenação (pois a grade já foi homologada e publicada).'
        : 'Disponibilidade registrada com sucesso.',
      disponibilidade: novaDisp
    });
  } catch (err) {
    next(err);
  }
}

// PUT /api/disponibilidades/:id (Obrigatório)
async function updateDisponibilidade(req, res, next) {
  try {
    const user = req.user;
    const { id } = req.params;
    const { dia, inicio, fim, status } = req.body;

    const index = mockStore.disponibilidades.findIndex(d => d.id === id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Disponibilidade não encontrada.'
      });
    }

    const dispExistente = mockStore.disponibilidades[index];

    // Professor só pode atualizar sua própria disponibilidade
    if (user.perfil === 'professor' && dispExistente.professor_id !== user.professor_id) {
      return res.status(403).json({
        success: false,
        message: 'Permissão negada para alterar a disponibilidade de outro docente.'
      });
    }

    const gradePublicadaExiste = mockStore.versoes_horario.some(v => v.status === 'publicada');

    let novoStatus = dispExistente.status;
    if (user.perfil === 'coordenador' && status) {
      novoStatus = status;
    } else if (gradePublicadaExiste && user.perfil === 'professor') {
      novoStatus = 'pendente_aprovacao';
    }

    mockStore.disponibilidades[index] = {
      ...dispExistente,
      dia: dia ? dia.toLowerCase() : dispExistente.dia,
      inicio: inicio || dispExistente.inicio,
      fim: fim || dispExistente.fim,
      status: novoStatus,
      atualizado_em: new Date().toISOString()
    };

    await recordAudit(user.id, 'ATUALIZAR_DISPONIBILIDADE', {
      id,
      antes: dispExistente,
      depois: mockStore.disponibilidades[index]
    });

    return res.status(200).json({
      success: true,
      message: novoStatus === 'pendente_aprovacao'
        ? 'Alteração enviada para análise da coordenação sem impactar a grade publicada.'
        : 'Disponibilidade atualizada com sucesso.',
      disponibilidade: mockStore.disponibilidades[index]
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getDisponibilidades,
  createDisponibilidade,
  updateDisponibilidade
};

