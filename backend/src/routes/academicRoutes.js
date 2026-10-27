// ====================================================================
// SUCELSO TECH - Rotas Acadêmicas (Disciplinas, Salas, Turmas, Professores)
// ====================================================================

const express = require('express');
const router = express.Router();
const academicController = require('../controllers/academicController');
const authMiddleware = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Todos os usuários autenticados (Aluno, Professor, Coordenador) podem consultar
router.get('/disciplinas', authMiddleware, academicController.getDisciplinas);
router.get('/salas', authMiddleware, academicController.getSalas);
router.get('/turmas', authMiddleware, academicController.getTurmas);
router.get('/professores', authMiddleware, academicController.getProfessores);
router.get('/alunos', authMiddleware, academicController.getAlunos);
router.get('/turma-disciplinas', authMiddleware, academicController.getTurmaDisciplinas);

// Apenas Coordenador pode criar cadastros acadêmicos
router.post('/disciplinas', authMiddleware, roleCheck('coordenador'), academicController.createDisciplina);
router.post('/salas', authMiddleware, roleCheck('coordenador'), academicController.createSala);

module.exports = router;

