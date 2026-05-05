const express  = require('express');
const speakeasy = require('speakeasy');
const qrcode   = require('qrcode');
const qrcodeTerminal = require('qrcode-terminal');
const bcrypt         = require('bcrypt');
const jwt            = require('jsonwebtoken');

const { upsertSecret, findByEmailAndApp } = require('../models/totpModel');
const { findByEmail, create }             = require('../models/usuarioModel');
const jwtAuth                             = require('../middlewares/jwtAuth');

const router = express.Router();
// POST /totp/register
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Se requieren email y password' });
  }

  const existe = await findByEmail(email);
  if (existe) {
    return res.status(409).json({ error: 'El email ya está registrado' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const usuario = await create(email, passwordHash);

  res.status(201).json({ message: 'Usuario creado', usuario });
});

// POST /totp/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Se requieren email y password' });
  }

  const usuario = await findByEmail(email);
  if (!usuario) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const passwordOk = await bcrypt.compare(password, usuario.password_hash);
  if (!passwordOk) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const token = jwt.sign(
    { id: usuario.id, email: usuario.email },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );

  res.json({ token });
});

// POST /totp/generate-qr
router.post('/generate-qr', async (req, res) => {
  const { email, appName } = req.body;

  if (!email || !appName) {
    return res.status(400).json({ error: 'Se requieren email y appName' });
  }

  const secret = speakeasy.generateSecret({ length: 20 });
  const otpauthUrl = speakeasy.otpauthURL({
    secret:   secret.base32,
    label:    `${appName}:${email}`,
    issuer:   appName,
    encoding: 'base32',
  });

  await upsertSecret(email, appName, secret.base32);

  qrcodeTerminal.generate(otpauthUrl, { small: true }, (qr) => {
    console.log(`QR para ${email} / ${appName}`);
    console.log(qr);
  });

  qrcode.toDataURL(otpauthUrl, (err, dataUrl) => {
    if (err) return res.status(500).json({ error: 'Error generando QR' });
    res.json({ secret: secret.base32, qrcode: dataUrl });
  });
});


router.get('/test-error', (req, res, next) => {
  next(new Error('Error de prueba del errorHandler'));
});
// POST /totp/verify
router.post('/verify', async (req, res) => {
  const { email, appName, token } = req.body;

  if (!email || !appName || !token) {
    return res.status(400).json({ error: 'Se requieren email, appName y token' });
  }

  if (!/^\d{6}$/.test(token)) {
    return res.status(400).json({ error: 'El token debe ser un número de 6 dígitos' });
  }

  const record = await findByEmailAndApp(email, appName);
  if (!record) {
    return res.status(404).json({ error: 'No existe un secret para ese email/appName. Generá el QR primero.' });
  }

  const verified = speakeasy.totp.verify({
    secret:   record.secret,
    encoding: 'base32',
    token,
    window:   1,
  });
  res.status(verified ? 200 : 400).json({ valid: verified });
});

module.exports = router;