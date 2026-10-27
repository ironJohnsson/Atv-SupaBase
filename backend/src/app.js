// ====================================================================
// SUCELSO TECH - Configuração da Aplicação Express
// ====================================================================

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middlewares de Segurança e CORS
app.use(helmet());
app.use(cors({
  origin: '*', // Permite requisições da Vercel, localhost ou qualquer origem
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parser JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota raiz de boas-vindas
app.get('/', (req, res) => {
  res.json({
    projeto: 'SUCELSO TECH - Sistema Inteligente de Horários Escolares',
    curso: 'Engenharia de Computação - SENAI CIMATEC',
    professor: 'Celso Barreto',
    api_docs: '/api/health'
  });
});

// Rotas da API
app.use('/api', routes);

// Middleware Central de Erros
app.use(errorHandler);

module.exports = app;

