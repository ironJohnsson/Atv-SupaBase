// ====================================================================
// SUCELSO TECH - Serviço de Auditoria e Histórico de Alterações
// ====================================================================

const mockStore = require('../config/mockData');
const supabase = require('../config/supabase');

async function recordAudit(usuarioId, operacao, valoresAlterados) {
  const auditEntry = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    usuario_id: usuarioId,
    operacao,
    data: new Date().toISOString(),
    valores_alterados: valoresAlterados
  };

  // Salvar no mockStore
  mockStore.historico_alteracoes.unshift(auditEntry);

  // Se Supabase estiver conectado, salvar no banco também
  if (supabase) {
    try {
      await supabase.from('historico_alteracoes').insert([{
        usuario_id: usuarioId,
        operacao,
        valores_alterados: valoresAlterados
      }]);
    } catch (err) {
      console.warn('Aviso: falha ao persistir auditoria no Supabase:', err.message);
    }
  }

  return auditEntry;
}

module.exports = {
  recordAudit
};

