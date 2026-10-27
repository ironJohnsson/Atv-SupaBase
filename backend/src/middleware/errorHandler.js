// ====================================================================
// SUCELSO TECH - Middleware Centralizado de Tratamento de Erros
// ====================================================================

function errorHandler(err, req, res, next) {
  console.error('❌ Erro capturado:', err);

  const status = err.statusCode || err.status || 500;
  const message = err.message || 'Ocorreu um erro interno no servidor.';

  return res.status(status).json({
    success: false,
    message,
    detalhes: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}

module.exports = errorHandler;

