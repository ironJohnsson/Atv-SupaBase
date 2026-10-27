// ====================================================================
// SUCELSO TECH - Rotas de Horários, Geração e Conflitos
// ====================================================================

const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const authMiddleware = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.use(authMiddleware);

// 1. Consultar horário do aluno (Obrigatório)
router.get('/minha-turma', scheduleController.getMinhaTurma);

// 2. Consultar horário docente (Obrigatório)
router.get('/professor', roleCheck('professor', 'coordenador'), scheduleController.getHorarioProfessor);

// 3. Consultar todos os horários (com filtros)
router.get('/todos', scheduleController.getTodosHorarios);

// 4. Consultar conflitos da grade (Obrigatório)
router.get('/conflitos', scheduleController.getConflitos);

// 5. Indicadores de ocupação de salas (Diferencial de Excelência)
router.get('/ocupacao-salas', scheduleController.getOcupacaoSalas);

// 6. Consultar versões de grade
router.get('/versoes', scheduleController.getVersoes);

// 7. Gerar proposta de grade automática (Obrigatório - Apenas Coordenador)
router.post('/gerar', roleCheck('coordenador'), scheduleController.gerarProposta);

// 8. Alterar alocação de horário/slot (Obrigatório - Apenas Coordenador)
router.put('/:id', roleCheck('coordenador'), scheduleController.updateHorario);

// 9. Publicar versão oficial da grade (Obrigatório - Apenas Coordenador)
router.post('/versoes/:id/publicar', roleCheck('coordenador'), scheduleController.publicarVersao);

// 10. Consultar histórico de auditoria (Apenas Coordenador)
router.get('/historico', roleCheck('coordenador'), scheduleController.getHistorico);

module.exports = router;

