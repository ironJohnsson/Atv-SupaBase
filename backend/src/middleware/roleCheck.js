// ====================================================================
// SUCELSO TECH - Middleware de Autorização por Perfil (RBAC)
// ====================================================================

function roleCheck(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Acesso não autenticado.'
      });
    }

    if (!allowedRoles.includes(req.user.perfil)) {
      return res.status(403).json({
        success: false,
        message: `Acesso negado: Perfil '${req.user.perfil}' não tem permissão para executar esta operação. Permissões requeridas: [${allowedRoles.join(', ')}].`
      });
    }

    next();
  };
}

module.exports = roleCheck;

