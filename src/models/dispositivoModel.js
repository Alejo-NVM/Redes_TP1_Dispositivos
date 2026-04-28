// src/models/dispositivoModel.js
const { getConnection, sql } = require('../db/connection');

const getAll = async (estado) => {
  const pool = await getConnection();
  let query = 'SELECT * FROM Dispositivos';
  const request = pool.request();
  if (estado) {
    query += ' WHERE estado = @estado';
    request.input('estado', sql.NVarChar, estado);
  }
  const result = await request.query(query);
  return result.recordset;
};

const getById = async (id) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('id', sql.Int, parseInt(id))
    .query('SELECT * FROM Dispositivos WHERE id = @id');
  return result.recordset;
};

const create = async (nombre, ip, estado, tipo) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('nombre', sql.NVarChar, nombre)
    .input('ip',     sql.NVarChar, ip)
    .input('estado', sql.NVarChar, estado)
    .input('tipo',   sql.NVarChar, tipo)
    .query(`
      INSERT INTO Dispositivos (nombre, ip, estado, tipo)
      OUTPUT INSERTED.*
      VALUES (@nombre, @ip, @estado, @tipo)
    `);
  return result.recordset;
};

const update = async (id, nombre, ip, estado, tipo) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('id',     sql.Int,      parseInt(id))
    .input('nombre', sql.NVarChar, nombre)
    .input('ip',     sql.NVarChar, ip)
    .input('estado', sql.NVarChar, estado)
    .input('tipo',   sql.NVarChar, tipo)
    .query(`
      UPDATE Dispositivos
      SET nombre = @nombre, ip = @ip, estado = @estado, tipo = @tipo
      OUTPUT INSERTED.*
      WHERE id = @id
    `);
  return result.recordset;
};

const remove = async (id) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('id', sql.Int, parseInt(id))
    .query('DELETE FROM Dispositivos OUTPUT DELETED.* WHERE id = @id');
  return result.recordset;
};

module.exports = { getAll, getById, create, update, remove };