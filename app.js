const express = require('express');
require('dotenv').config();

const app = express();

app.use(express.json());


const logger = require('./src/middlewares/logger');
const auth   = require('./src/middlewares/auth');

app.use(logger); 
//app.use(auth);  

const totpRouter = require('./src/routes/totp');
app.use('/totp', totpRouter);

const dispositivosRouter = require('./src/routes/dispositivos');
app.use('/dispositivos', auth,dispositivosRouter);

const errorHandler = require('./src/middlewares/error');
app.use(errorHandler);

app.get('/', (req, res) => {
  res.json({ mensaje: 'API de Dispositivos en Red corriendo ✓' });
});

module.exports = app;