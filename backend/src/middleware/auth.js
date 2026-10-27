// ====================================================================
// SUCELSO TECH - Middleware de Autenticação JWT
// ====================================================================

const jwt = require('jsonwebtoken');
const env = require('../config/env');
const mockStore = require('../config/mockData');
const supabase = require('../config/supabase');

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token de autenticação não fornecido ou inválido.'
      });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, env.jwtSecret);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Sessão expirada ou token inválido. Faça login novamente.'
      });
    }

    let user = null;

    // Se Supabase estiver ativo, podemos verificar no banco, caso contrário no mockStore
    if (supabase) {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', decoded.id)
        .single();
      
      if (!error && data) {
        user = data;
        if (user.perfil === 'professor') {
          const { data: profData } = await supabase
            .from('professores')
            .select('id, matricula')
            .eq('usuario_id', user.id)
            .single();
          if (profData) {
            user.professor_id = profData.id;
            user.matricula = profData.matricula;
          }
        } else if (user.perfil === 'aluno') {
          const { data: alunoData } = await supabase
            .from('alunos')
            .select('id, matricula, turma_id')
            .eq('usuario_id', user.id)
            .single();
          if (alunoData) {
            user.aluno_id = alunoData.id;
            user.matricula = alunoData.matricula;
            user.turma_id = alunoData.turma_id;
          }
        }
      }
    }

    if (!user) {
      // Fallback para mockStore
      const found = mockStore.usuarios.find(u => u.id === decoded.id || u.email === decoded.email);
      if (found) {
        user = { ...found };
        if (user.perfil === 'professor') {
          const prof = mockStore.professores.find(p => p.usuario_id === user.id);
          if (prof) {
            user.professor_id = prof.id;
            user.matricula = prof.matricula;
          }
        } else if (user.perfil === 'aluno') {
          const alu = mockStore.alunos.find(a => a.usuario_id === user.id);
          if (alu) {
            user.aluno_id = alu.id;
            user.matricula = alu.matricula;
            user.turma_id = alu.turma_id;
          }
        }
      }
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não localizado no sistema.'
      });
    }

    // Define no request para os controladores utilizarem
    req.user = {
      id: user.id,
      nome: user.nome,
      email: user.email,
      perfil: user.perfil,
      professor_id: user.professor_id,
      aluno_id: user.aluno_id,
      turma_id: user.turma_id
    };

    next();
  } catch (error) {
    console.error('Erro no middleware de autenticação:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno ao validar credenciais.'
    });
  }
}

module.exports = authMiddleware;

