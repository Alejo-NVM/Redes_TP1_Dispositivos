const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.path}`, err.message);

  if (err.code === 'ESOCKET' || err.code === 'ELOGIN') {
    return res.status(503).json({ error: 'Error de conexión a la base de datos' });
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }

  res.status(err.status ?? 500).json({
    error: err.message ?? 'Error interno del servidor',
  });
};

module.exports = errorHandler;