// ====================================================================
// SUCELSO TECH - Controlador de Autenticação (Login / Sessão)
// ====================================================================

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const env = require('../config/env');
const mockStore = require('../config/mockData');
const supabase = require('../config/supabase');

async function login(req, res, next) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        success: false,
        message: 'E-mail e senha são obrigatórios.'
      });
    }

    let user = null;

    // 1. Tentar localizar via Supabase se estiver configurado
    if (supabase) {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email.trim().toLowerCase())
        .single();
      
      if (!error && data) {
        user = data;
      }
    }

    // 2. Fallback para mockStore caso Supabase não esteja ativo ou não encontre
    if (!user) {
      user = mockStore.usuarios.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas: e-mail não encontrado.'
      });
    }

    // 3. Validação da senha criptografada (bcrypt)
    // Permite login direto se a senha for 'senha123' ou compatível com o hash
    let senhaValida = false;
    if (user.senha_hash) {
      senhaValida = await bcrypt.compare(senha, user.senha_hash);
    }
    // Fallback de desenvolvimento caso venha texto puro 'senha123'
    if (!senhaValida && senha === 'senha123') {
      senhaValida = true;
    }

    if (!senhaValida) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas: senha incorreta.'
      });
    }

    // 4. Buscar metadados adicionais do perfil
    let teacherInfo = null;
    let studentInfo = null;

    if (user.perfil === 'professor') {
      teacherInfo = mockStore.professores.find(p => p.usuario_id === user.id);
    } else if (user.perfil === 'aluno') {
      studentInfo = mockStore.alunos.find(a => a.usuario_id === user.id);
    }

    // 5. Geração do Token JWT Seguro
    const payload = {
      id: user.id,
      email: user.email,
      perfil: user.perfil,
      nome: user.nome,
      professor_id: teacherInfo?.id,
      aluno_id: studentInfo?.id,
      turma_id: studentInfo?.turma_id
    };

    const token = jwt.sign(payload, env.jwtSecret, { expiresIn: '8h' });

    return res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso.',
      token,
      usuario: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        perfil: user.perfil,
        professor_id: teacherInfo?.id,
        matricula: teacherInfo?.matricula || studentInfo?.matricula,
        turma_id: studentInfo?.turma_id
      }
    });
  } catch (error) {
    next(error);
  }
}

async function me(req, res) {
  return res.status(200).json({
    success: true,
    usuario: req.user
  });
}

module.exports = {
  login,
  me
};

