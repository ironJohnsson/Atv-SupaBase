// ====================================================================
// SUCELSO TECH - Roteador Central da API
// ====================================================================

const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const academicRoutes = require('./academicRoutes');
const availabilityRoutes = require('./availabilityRoutes');
const scheduleRoutes = require('./scheduleRoutes');

// Rota de Healthcheck
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    sistema: 'SUCELSO TECH - Sistema Inteligente de Horários Escolares',
    instituicao: 'SENAI CIMATEC',
    timestamp: new Date().toISOString()
  });
});

router.use('/auth', authRoutes);
router.use('/horarios', scheduleRoutes);
router.use('/disponibilidades', availabilityRoutes);
router.use('/', academicRoutes);

module.exports = router;

