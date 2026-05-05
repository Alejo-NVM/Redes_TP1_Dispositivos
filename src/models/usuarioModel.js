const { getConnection, sql } = require('../db/connection');

const findByEmail = async (email) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('email', sql.NVarChar(255), email)
    .query('SELECT * FROM usuarios WHERE email = @email');
  return result.recordset[0] ?? null;
};

const create = async (email, passwordHash) => {
  const pool = await getConnection();
  const result = await pool.request()
    .input('email',        sql.NVarChar(255), email)
    .input('passwordHash', sql.NVarChar(255), passwordHash)
    .query(`
      INSERT INTO usuarios (email, password_hash)
      OUTPUT INSERTED.id, INSERTED.email, INSERTED.created_at
      VALUES (@email, @passwordHash)
    `);
  return result.recordset[0];
};

module.exports = { findByEmail, create };