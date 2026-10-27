// ====================================================================
// SUCELSO TECH - Rotas de Disponibilidade Docente
// ====================================================================

const express = require('express');
const router = express.Router();
const availabilityController = require('../controllers/availabilityController');
const authMiddleware = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Apenas Professor e Coordenador têm acesso a disponibilidades
router.use(authMiddleware);
router.use(roleCheck('professor', 'coordenador'));

router.get('/', availabilityController.getDisponibilidades);
router.post('/', availabilityController.createDisponibilidade);
router.put('/:id', availabilityController.updateDisponibilidade);

module.exports = router;

