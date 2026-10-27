// ====================================================================
// SUCELSO TECH - Servidor Principal Node.js / Express
// ====================================================================

const app = require('./src/app');
const env = require('./src/config/env');

const PORT = env.port || 5000;

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 SUCELSO TECH - API REST rodando com sucesso!`);
  console.log(`📡 Porta: ${PORT}`);
  console.log(`🌍 Modo: ${env.nodeEnv}`);
  console.log(`🔗 URL Base: http://localhost:${PORT}`);
  console.log(`🎓 SENAI CIMATEC - Engenharia de Computação`);
  console.log(`👨‍🏫 Prof. Celso Barreto`);
  console.log(`====================================================`);
});

