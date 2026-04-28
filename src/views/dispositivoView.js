// src/views/dispositivoView.js

const success = (res, statusCode, data) => {
  res.status(statusCode).json(data);
};

const error = (res, statusCode, mensaje) => {
  res.status(statusCode).json({ error: mensaje });
};

module.exports = { success, error };