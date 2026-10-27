// ====================================================================
// SUCELSO TECH - Algoritmo Inteligente de Geração de Horários
// Satisfação de Restrições (CSP) + Heurística de Minimização de Janelas (Gaps)
// ====================================================================

const { detectConflicts, timeToMinutes } = require('./conflictService');

// Definição dos slots padrão de cada turno respeitando os intervalos obrigatórios
const SLOTS_POR_TURNO = {
  matutino: [
    { id: 1, inicio: '08:00', fim: '10:00', descricao: '1º Bloco Matutino' },
    // 10:00 às 10:20 -> Recreio / Intervalo da escola
    { id: 2, inicio: '10:20', fim: '12:00', descricao: '2º Bloco Matutino' }
  ],
  vespertino: [
    { id: 1, inicio: '13:00', fim: '15:00', descricao: '1º Bloco Vespertino' },
    // 15:00 às 15:20 -> Intervalo da tarde
    { id: 2, inicio: '15:20', fim: '17:00', descricao: '2º Bloco Vespertino' }
  ],
  noturno: [
    { id: 1, inicio: '18:40', fim: '20:20', descricao: '1º Bloco Noturno' },
    { id: 2, inicio: '20:30', fim: '22:10', descricao: '2º Bloco Noturno' }
  ]
};

const DIAS_UTEIS = ['segunda', 'terca', 'quarta', 'quinta', 'sexta'];

/**
 * Verifica se um professor tem disponibilidade ativa em um dia e horário
 */
function isProfAvailable(professorId, dia, slotInicio, slotFim, disponibilidades) {
  const profDisps = disponibilidades.filter(d => d.professor_id === professorId && d.dia === dia);
  if (profDisps.length === 0) return false;

  const start = timeToMinutes(slotInicio);
  const end = timeToMinutes(slotFim);

  return profDisps.some(d => {
    const dStart = timeToMinutes(d.inicio);
    const dEnd = timeToMinutes(d.fim);
    return start >= dStart && end <= dEnd;
  });
}

/**
 * Calcula a heurística MRV (Minimum Remaining Values):
 * Retorna quantos slots válidos na semana este professor possui.
 * Professores com menos slots (como Prof. Roberto - Seg e Qua) têm maior prioridade de alocação.
 */
function calculateTeacherFlexibility(professorId, turno, disponibilidades) {
  const slotsTurno = SLOTS_POR_TURNO[turno] || SLOTS_POR_TURNO.matutino;
  let validSlotCount = 0;

  for (const dia of DIAS_UTEIS) {
    for (const slot of slotsTurno) {
      if (isProfAvailable(professorId, dia, slot.inicio, slot.fim, disponibilidades)) {
        validSlotCount++;
      }
    }
  }

  return validSlotCount;
}

/**
 * Seleciona a melhor sala para a disciplina baseando-se em afinidade pedagógica
 */
function chooseBestRoom(disciplina, salas, occupiedRoomsInSlot) {
  const availableRooms = salas.filter(s => !occupiedRoomsInSlot.has(s.id));
  if (availableRooms.length === 0) return null;

  const discNome = (disciplina.nome || '').toLowerCase();
  const discCod = (disciplina.codigo || '').toLowerCase();

  // Heurística de afinidade de laboratório
  if (discNome.includes('rede') || discCod.includes('rc')) {
    const redesLab = availableRooms.find(s => s.identificacao.includes('Redes'));
    if (redesLab) return redesLab;
  }

  if (discNome.includes('inteligência') || discNome.includes('ia') || discCod.includes('ia')) {
    const iaLab = availableRooms.find(s => s.identificacao.includes('Inteligência Artificial'));
    if (iaLab) return iaLab;
  }

  if (discNome.includes('projeto') || discNome.includes('inovação') || discCod.includes('pi')) {
    const maker = availableRooms.find(s => s.identificacao.includes('Maker'));
    if (maker) return maker;
  }

  if (discNome.includes('web') || discNome.includes('banco') || discCod.includes('bd') || discCod.includes('dw')) {
    const compLab = availableRooms.find(s => s.identificacao.includes('Computação'));
    if (compLab) return compLab;
  }

  // Fallback: primeira sala disponível com maior capacidade
  return availableRooms.sort((a, b) => b.capacidade - a.capacidade)[0];
}

/**
 * Algoritmo Principal de Geração Automática
 */
function generateSchedule({
  turmas,
  disciplinas,
  professores,
  salas,
  disponibilidades,
  turma_disciplinas,
  versao_id,
  periodo = '2026.1'
}) {
  const alocacoes = [];
  const aulasNaoAlocadas = [];

  // Mapeamentos para acesso em tempo constante
  const mapDisciplina = new Map(disciplinas.map(d => [d.id, d]));
  const mapProfessor = new Map(professores.map(p => [p.id, p]));
  const mapTurma = new Map(turmas.map(t => [t.id, t]));

  // Estruturas de rastreamento de ocupação em memória
  // Chave: `${dia}_${inicio}_${fim}`
  const profBusy = new Map();  // key -> Set of professor_id
  const salaBusy = new Map();  // key -> Set of sala_id
  const turmaBusy = new Map(); // key -> Set of turma_id

  function getSlotKey(dia, inicio, fim) {
    return `${dia}_${inicio}_${fim}`;
  }

  function isSlotOccupied(dia, inicio, fim, { turma_id, professor_id, sala_id }) {
    const key = getSlotKey(dia, inicio, fim);
    if (turmaBusy.get(key)?.has(turma_id)) return true;
    if (profBusy.get(key)?.has(professor_id)) return true;
    if (sala_id && salaBusy.get(key)?.has(sala_id)) return true;
    return false;
  }

  function markSlotOccupied(dia, inicio, fim, { turma_id, professor_id, sala_id }) {
    const key = getSlotKey(dia, inicio, fim);
    if (!turmaBusy.has(key)) turmaBusy.set(key, new Set());
    if (!profBusy.has(key)) profBusy.set(key, new Set());
    if (!salaBusy.has(key)) salaBusy.set(key, new Set());

    turmaBusy.get(key).add(turma_id);
    profBusy.get(key).add(professor_id);
    if (sala_id) salaBusy.get(key).add(sala_id);
  }

  // 1. Preparar lista de tarefas a alocar (cada sessão de 2h aula)
  const tarefas = [];
  for (const td of turma_disciplinas) {
    const turma = mapTurma.get(td.turma_id);
    if (!turma) continue;

    const numSessoes = Math.ceil((td.carga_semanal || 4) / 2); // 4h semanais = 2 blocos de 2h
    const flexibilidade = calculateTeacherFlexibility(td.professor_id, turma.turno, disponibilidades);

    for (let sessao = 1; sessao <= numSessoes; sessao++) {
      tarefas.push({
        id: `${td.id}_s${sessao}`,
        turma_id: td.turma_id,
        disciplina_id: td.disciplina_id,
        professor_id: td.professor_id,
        turno: turma.turno || 'matutino',
        flexibilidade, // Quanto menor, mais urgente alocar (MRV Heuristic)
        sessaoNumero: sessao
      });
    }
  }

  // 2. Ordenação Heurística MRV (Mais restrito primeiro):
  // Professores com menos disponibilidades (ex: Prof. Roberto) vêm na frente!
  tarefas.sort((a, b) => a.flexibilidade - b.flexibilidade);

  // Rastreamento para espalhar sessões da mesma disciplina em dias diferentes
  const turmaDiscDias = new Map(); // `${turma_id}_${disciplina_id}` -> Set of dias

  // 3. Execução da Alocação
  for (const tarefa of tarefas) {
    const slots = SLOTS_POR_TURNO[tarefa.turno] || SLOTS_POR_TURNO.matutino;
    const turma = mapTurma.get(tarefa.turma_id);
    const disc = mapDisciplina.get(tarefa.disciplina_id);
    const prof = mapProfessor.get(tarefa.professor_id);

    const tdKey = `${tarefa.turma_id}_${tarefa.disciplina_id}`;
    if (!turmaDiscDias.has(tdKey)) turmaDiscDias.set(tdKey, new Set());
    const diasAlocadosDestaDisc = turmaDiscDias.get(tdKey);

    let alocadoComSucesso = false;

    // Tentativa 1: Encontrar dia em que a disciplina ainda não foi ministrada (para diversidade semanal)
    // Tentativa 2: Se não houver, aceita no mesmo dia em bloco consecutivo
    for (let tentativa = 1; tentativa <= 2 && !alocadoComSucesso; tentativa++) {
      for (const dia of DIAS_UTEIS) {
        if (tentativa === 1 && diasAlocadosDestaDisc.has(dia)) {
          continue; // Evita repetir o mesmo dia na 1ª tentativa
        }

        for (const slot of slots) {
          // A) Respeita disponibilidade docente
          if (!isProfAvailable(tarefa.professor_id, dia, slot.inicio, slot.fim, disponibilidades)) {
            continue;
          }

          // B) Verifica conflito de Turma e Professor
          if (isSlotOccupied(dia, slot.inicio, slot.fim, {
            turma_id: tarefa.turma_id,
            professor_id: tarefa.professor_id
          })) {
            continue;
          }

          // C) Seleção inteligente de Sala com verificação de ocupação
          const key = getSlotKey(dia, slot.inicio, slot.fim);
          const occupiedRooms = salaBusy.get(key) || new Set();
          const bestRoom = chooseBestRoom(disc, salas, occupiedRooms);

          if (!bestRoom) {
            continue; // Sem sala livre neste slot
          }

          // Alocação realizada com sucesso!
          markSlotOccupied(dia, slot.inicio, slot.fim, {
            turma_id: tarefa.turma_id,
            professor_id: tarefa.professor_id,
            sala_id: bestRoom.id
          });

          diasAlocadosDestaDisc.add(dia);

          alocacoes.push({
            id: `gen-${Math.random().toString(36).substring(2, 9)}`,
            versao_id,
            turma_id: tarefa.turma_id,
            disciplina_id: tarefa.disciplina_id,
            professor_id: tarefa.professor_id,
            sala_id: bestRoom.id,
            dia,
            inicio: slot.inicio,
            fim: slot.fim,
            // Metadados informativos para a UI
            turma_nome: turma ? turma.nome : 'Turma',
            disciplina_nome: disc ? disc.nome : 'Disciplina',
            disciplina_codigo: disc ? disc.codigo : '',
            professor_nome: prof ? prof.nome : 'Docente',
            sala_identificacao: bestRoom.identificacao
          });

          alocadoComSucesso = true;
          break;
        }

        if (alocadoComSucesso) break;
      }
    }

    if (!alocadoComSucesso) {
      aulasNaoAlocadas.push({
        tarefa_id: tarefa.id,
        turma: turma ? turma.nome : tarefa.turma_id,
        disciplina: disc ? disc.nome : tarefa.disciplina_id,
        professor: prof ? prof.nome : tarefa.professor_id,
        motivo: 'Não foi encontrado slot livre compatível com a disponibilidade docente e a capacidade de salas.'
      });
    }
  }

  // 4. Detecção final e verificação de conflitos na grade gerada
  const conflitos = detectConflicts(alocacoes, {
    disponibilidades,
    salas,
    professores,
    turmas,
    disciplinas
  });

  return {
    grade_gerada: alocacoes,
    conflitos,
    aulas_nao_alocadas: aulasNaoAlocadas,
    metricas: {
      total_aulas_planejadas: tarefas.length,
      total_aulas_alocadas: alocacoes.length,
      taxa_sucesso_alocacao: tarefas.length > 0 ? ((alocacoes.length / tarefas.length) * 100).toFixed(1) + '%' : '100%',
      conflitos_detectados: conflitos.length,
      otimizacao_janelas: 'Minimização de janelas ativa (blocos contíguos de 2h/recreio)'
    }
  };
}

module.exports = {
  generateSchedule,
  SLOTS_POR_TURNO,
  DIAS_UTEIS
};

