// ====================================================================
// SUCELSO TECH - Serviço de Detecção de Conflitos de Grade
// ====================================================================

/**
 * Normaliza horários para minutos a partir de 00:00 para comparações precisas
 */
function timeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Verifica sobreposição temporal entre dois intervalos [ini1, fim1] e [ini2, fim2]
 */
function hasOverlap(ini1, fim1, ini2, fim2) {
  const startA = timeToMinutes(ini1);
  const endA = timeToMinutes(fim1);
  const startB = timeToMinutes(ini2);
  const endB = timeToMinutes(fim2);

  return Math.max(startA, startB) < Math.min(endA, endB);
}

/**
 * Verifica se o slot está contido em alguma disponibilidade do professor
 */
function isSlotWithinAvailability(slot, teacherAvailabilities) {
  if (!teacherAvailabilities || teacherAvailabilities.length === 0) return false;

  const slotStart = timeToMinutes(slot.inicio);
  const slotEnd = timeToMinutes(slot.fim);

  return teacherAvailabilities.some(av => {
    if (av.dia !== slot.dia) return false;
    const avStart = timeToMinutes(av.inicio);
    const avEnd = timeToMinutes(av.fim);
    return slotStart >= avStart && slotEnd <= avEnd;
  });
}

/**
 * Analisa uma lista de alocações (horários) e retorna relatório completo de conflitos
 */
function detectConflicts(horarios, options = {}) {
  const { disponibilidades = [], salas = [], professores = [], turmas = [], disciplinas = [] } = options;

  const conflitos = [];
  const mapProf = new Map(professores.map(p => [p.id, p.nome || p.matricula]));
  const mapSala = new Map(salas.map(s => [s.id, s.identificacao]));
  const mapTurma = new Map(turmas.map(t => [t.id, t.nome]));
  const mapDisc = new Map(disciplinas.map(d => [d.id, d.nome]));

  // 1. Verificação de conflitos par a par (Professor, Sala e Turma simultâneos)
  for (let i = 0; i < horarios.length; i++) {
    const a = horarios[i];

    for (let j = i + 1; j < horarios.length; j++) {
      const b = horarios[j];

      // Devem ser no mesmo dia da semana
      if (a.dia !== b.dia) continue;

      // Verificação de sobreposição de horário
      if (!hasOverlap(a.inicio, a.fim, b.inicio, b.fim)) continue;

      // Conflito 1: Professor em duas salas/turmas ao mesmo tempo
      if (a.professor_id === b.professor_id) {
        conflitos.push({
          tipo: 'PROFESSOR_DUPLICADO',
          gravidade: 'ALTA',
          dia: a.dia,
          horario: `${a.inicio} - ${a.fim}`,
          professor_id: a.professor_id,
          professor_nome: mapProf.get(a.professor_id) || 'Docente',
          turma_a: mapTurma.get(a.turma_id) || a.turma_id,
          turma_b: mapTurma.get(b.turma_id) || b.turma_id,
          mensagem: `O ${mapProf.get(a.professor_id) || 'professor'} está alocado simultaneamente na ${mapTurma.get(a.turma_id)} e na ${mapTurma.get(b.turma_id)} na ${a.dia} das ${a.inicio} às ${a.fim}.`
        });
      }

      // Conflito 2: Mesma Sala com duas turmas ao mesmo tempo
      if (a.sala_id === b.sala_id) {
        conflitos.push({
          tipo: 'SALA_DUPLICADA',
          gravidade: 'ALTA',
          dia: a.dia,
          horario: `${a.inicio} - ${a.fim}`,
          sala_id: a.sala_id,
          sala_identificacao: mapSala.get(a.sala_id) || 'Sala',
          turma_a: mapTurma.get(a.turma_id) || a.turma_id,
          turma_b: mapTurma.get(b.turma_id) || b.turma_id,
          mensagem: `A sala '${mapSala.get(a.sala_id)}' foi reservada para mais de uma turma simultaneamente na ${a.dia} (${a.inicio} - ${a.fim}).`
        });
      }

      // Conflito 3: Mesma Turma em duas aulas ao mesmo tempo
      if (a.turma_id === b.turma_id) {
        conflitos.push({
          tipo: 'TURMA_SOBREPOSTA',
          gravidade: 'ALTA',
          dia: a.dia,
          horario: `${a.inicio} - ${a.fim}`,
          turma_id: a.turma_id,
          turma_nome: mapTurma.get(a.turma_id) || 'Turma',
          disciplina_a: mapDisc.get(a.disciplina_id) || a.disciplina_id,
          disciplina_b: mapDisc.get(b.disciplina_id) || b.disciplina_id,
          mensagem: `A turma '${mapTurma.get(a.turma_id)}' possui duas disciplinas no mesmo horário na ${a.dia} (${a.inicio} - ${a.fim}).`
        });
      }
    }

    // 2. Verificação de desrespeito à disponibilidade docente cadastrada
    if (disponibilidades.length > 0) {
      const profAvailabilities = disponibilidades.filter(d => d.professor_id === a.professor_id);
      if (profAvailabilities.length > 0 && !isSlotWithinAvailability(a, profAvailabilities)) {
        conflitos.push({
          tipo: 'FORA_DA_DISPONIBILIDADE',
          gravidade: 'ALTA',
          dia: a.dia,
          horario: `${a.inicio} - ${a.fim}`,
          professor_id: a.professor_id,
          professor_nome: mapProf.get(a.professor_id) || 'Docente',
          turma_nome: mapTurma.get(a.turma_id) || a.turma_id,
          mensagem: `O ${mapProf.get(a.professor_id)} foi alocado na ${a.dia} (${a.inicio} - ${a.fim}) fora de sua janela de disponibilidade informada.`
        });
      }
    }
  }

  return conflitos;
}

module.exports = {
  detectConflicts,
  hasOverlap,
  timeToMinutes
};

