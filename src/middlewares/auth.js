require('dotenv').config();

const auth = (req, res, next) => {
  const token = req.headers['authorization']; 

  if (!token || token !== process.env.AUTH_TOKEN) {
    return res.status(401).json({ error: 'No autorizado. Header Authorization inválido o ausente.' });
  }

  next(); 
};

module.exports = auth;