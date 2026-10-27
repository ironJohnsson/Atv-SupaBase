// ====================================================================
// SUCELSO TECH - Conexão e Cliente Supabase
// ====================================================================

const { createClient } = require('@supabase/supabase-js');
const env = require('./env');

let supabase = null;

if (env.supabaseUrl && env.supabaseServiceKey) {
  try {
    supabase = createClient(env.supabaseUrl, env.supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    console.log('✅ Cliente Supabase configurado com sucesso para:', env.supabaseUrl);
  } catch (error) {
    console.warn('⚠️ Falha ao inicializar cliente Supabase:', error.message);
    supabase = null;
  }
} else {
  console.log('ℹ️ Variáveis SUPABASE_URL ou SUPABASE_SERVICE_KEY não fornecidas. O backend utilizará o repositório integrado de dados com validação completa.');
}

module.exports = supabase;

