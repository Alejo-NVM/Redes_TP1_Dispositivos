const { getConnection, sql } = require('../db/connection');

const upsertSecret = async (email, appName, secretBase32) => {
  const pool = await getConnection();

  await pool.request()
    .input('email',   sql.NVarChar(255), email)
    .input('appName', sql.NVarChar(100), appName)
    .input('secret',  sql.NVarChar(255), secretBase32)
    .query(`
      MERGE totp_secrets WITH (HOLDLOCK) AS target
      USING (VALUES (@email, @appName, @secret))
        AS source (email, app_name, secret)
        ON target.email    = source.email
       AND target.app_name = source.app_name
      WHEN MATCHED THEN
        UPDATE SET secret     = source.secret,
                   updated_at = GETUTCDATE()
      WHEN NOT MATCHED THEN
        INSERT (email, app_name, secret, created_at, updated_at)
        VALUES (source.email, source.app_name, source.secret, GETUTCDATE(), GETUTCDATE());
    `);

  return findByEmailAndApp(email, appName);
};

const findByEmailAndApp = async (email, appName) => {
  const pool = await getConnection();

  const result = await pool.request()
    .input('email',   sql.NVarChar(255), email)
    .input('appName', sql.NVarChar(100), appName)
    .query(`
      SELECT id, email, app_name, secret, created_at, updated_at
      FROM totp_secrets
      WHERE email = @email AND app_name = @appName
    `);

  return result.recordset[0] ?? null;
};

module.exports = { upsertSecret, findByEmailAndApp };