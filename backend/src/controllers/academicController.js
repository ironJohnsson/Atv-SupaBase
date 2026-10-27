// ====================================================================
// SUCELSO TECH - Controlador Acadêmico (Turmas, Disciplinas, Salas, etc.)
// ====================================================================

const mockStore = require('../config/mockData');
const supabase = require('../config/supabase');
const { recordAudit } = require('../services/auditService');

// GET /api/disciplinas (Obrigatório)
async function getDisciplinas(req, res, next) {
  try {
    if (supabase) {
      const { data, error } = await supabase.from('disciplinas').select('*').order('nome');
      if (!error && data && data.length > 0) {
        return res.status(200).json({ success: true, disciplinas: data });
      }
    }
    return res.status(200).json({ success: true, disciplinas: mockStore.disciplinas });
  } catch (err) {
    next(err);
  }
}

// GET /api/salas (Obrigatório)
async function getSalas(req, res, next) {
  try {
    if (supabase) {
      const { data, error } = await supabase.from('salas').select('*').order('identificacao');
      if (!error && data && data.length > 0) {
        return res.status(200).json({ success: true, salas: data });
      }
    }
    return res.status(200).json({ success: true, salas: mockStore.salas });
  } catch (err) {
    next(err);
  }
}

// GET /api/turmas
async function getTurmas(req, res, next) {
  try {
    if (supabase) {
      const { data, error } = await supabase.from('turmas').select('*').order('nome');
      if (!error && data && data.length > 0) {
        return res.status(200).json({ success: true, turmas: data });
      }
    }
    return res.status(200).json({ success: true, turmas: mockStore.turmas });
  } catch (err) {
    next(err);
  }
}

// GET /api/professores
async function getProfessores(req, res, next) {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('professores')
        .select('id, matricula, especialidade, usuarios(nome, email)');
      if (!error && data && data.length > 0) {
        const formatados = data.map(p => ({
          id: p.id,
          matricula: p.matricula,
          especialidade: p.especialidade,
          nome: p.usuarios?.nome || 'Docente',
          email: p.usuarios?.email || ''
        }));
        return res.status(200).json({ success: true, professores: formatados });
      }
    }
    return res.status(200).json({ success: true, professores: mockStore.professores });
  } catch (err) {
    next(err);
  }
}

// GET /api/alunos
async function getAlunos(req, res, next) {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('alunos')
        .select('id, matricula, turma_id, turmas(nome), usuarios(nome, email)');
      if (!error && data && data.length > 0) {
        return res.status(200).json({ success: true, alunos: data });
      }
    }
    return res.status(200).json({ success: true, alunos: mockStore.alunos });
  } catch (err) {
    next(err);
  }
}

// GET /api/turma-disciplinas
async function getTurmaDisciplinas(req, res, next) {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('turma_disciplinas')
        .select('*');
      if (!error && data && data.length > 0) {
        return res.status(200).json({ success: true, turma_disciplinas: data });
      }
    }
    return res.status(200).json({ success: true, turma_disciplinas: mockStore.turma_disciplinas });
  } catch (err) {
    next(err);
  }
}

// POST /api/disciplinas (Coordenador)
async function createDisciplina(req, res, next) {
  try {
    const { nome, codigo, carga_horaria } = req.body;
    if (!nome || !codigo || !carga_horaria) {
      return res.status(400).json({ success: false, message: 'Dados incompletos para criação de disciplina.' });
    }

    const novaDisc = {
      id: `disc-${Date.now()}`,
      nome,
      codigo: codigo.toUpperCase(),
      carga_horaria: Number(carga_horaria)
    };

    mockStore.disciplinas.push(novaDisc);
    await recordAudit(req.user.id, 'CRIAR_DISCIPLINA', novaDisc);

    return res.status(201).json({ success: true, disciplina: novaDisc });
  } catch (err) {
    next(err);
  }
}

// POST /api/salas (Coordenador)
async function createSala(req, res, next) {
  try {
    const { identificacao, capacidade, tipo } = req.body;
    if (!identificacao || !capacidade) {
      return res.status(400).json({ success: false, message: 'Identificação e capacidade são obrigatórias.' });
    }

    const novaSala = {
      id: `sala-${Date.now()}`,
      identificacao,
      capacidade: Number(capacidade),
      tipo: tipo || 'Sala de Aula'
    };

    mockStore.salas.push(novaSala);
    await recordAudit(req.user.id, 'CRIAR_SALA', novaSala);

    return res.status(201).json({ success: true, sala: novaSala });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getDisciplinas,
  getSalas,
  getTurmas,
  getProfessores,
  getAlunos,
  getTurmaDisciplinas,
  createDisciplina,
  createSala
};

