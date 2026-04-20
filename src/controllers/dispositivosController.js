const { getConnection, sql } = require('../db/connection');

// GET /dispositivos
const getAll = async (req, res) => {
  try {
    const pool = await getConnection();
    const { estado } = req.query; 

    let query = 'SELECT * FROM Dispositivos';

    if (estado) {
      query += ' WHERE estado = @estado';
    }

    const request = pool.request();

    if (estado) {
      request.input('estado', sql.NVarChar, estado);
    }

    const result = await request.query(query);
    res.status(200).json(result.recordset); 
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor', detalle: error.message });
  }
};

// GET /dispositivos/:id
const getById = async (req, res) => {
  try {
    const pool = await getConnection();
    const { id } = req.params; 

    const result = await pool.request()
      .input('id', sql.Int, parseInt(id))
      .query('SELECT * FROM Dispositivos WHERE id = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: `Dispositivo con ID ${id} no encontrado.` });
    }

    res.status(200).json(result.recordset[0]); 
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor', detalle: error.message });
  }
};

// POST /dispositivos
const create = async (req, res) => {
  try {
    const pool = await getConnection();
    const { nombre, ip, estado = 'activo', tipo } = req.body;



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

    res.status(201).json(result.recordset[0]); 
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor', detalle: error.message });
  }
};

// PUT /dispositivos/:id
const update = async (req, res) => {
  try {
    const pool = await getConnection();
    const { id } = req.params;
    const { nombre, ip, estado, tipo } = req.body;
    const estadoFinal = !estado || estado.trim() === '' ? 'activo' : estado;

    const existe = await pool.request()
      .input('id', sql.Int, parseInt(id))
      .query('SELECT id FROM Dispositivos WHERE id = @id');

    if (existe.recordset.length === 0) {
      return res.status(404).json({ error: `Dispositivo con ID ${id} no encontrado.` });
    }

    const result = await pool.request()
      .input('id',     sql.Int,    parseInt(id))
      .input('nombre', sql.NVarChar, nombre)
      .input('ip',     sql.NVarChar, ip)
      .input('estadoFinal', sql.NVarChar, estadoFinal)
      .input('tipo',   sql.NVarChar, tipo)
      .query(`
        UPDATE Dispositivos
        SET nombre = @nombre, ip = @ip, estado = @estadoFinal, tipo = @tipo
        OUTPUT INSERTED.*
        WHERE id = @id
      `);

    res.status(200).json(result.recordset[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor', detalle: error.message });
  }
};

// DELETE /dispositivos/:id
const remove = async (req, res) => {
  try {
    const pool = await getConnection();
    const { id } = req.params;

    const result = await pool.request()
      .input('id', sql.Int, parseInt(id))
      .query('DELETE FROM Dispositivos OUTPUT DELETED.* WHERE id = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: `Dispositivo con ID ${id} no encontrado.` });
    }

    res.status(200).json({ mensaje: 'Dispositivo eliminado.', dispositivo: result.recordset[0] });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor', detalle: error.message });
  }
};

module.exports = { getAll, getById, create, update, remove };