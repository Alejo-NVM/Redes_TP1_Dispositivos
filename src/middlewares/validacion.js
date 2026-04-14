// Regex para validar formato de IP (IPv4)
// Acepta valores 0-255 en cada octeto
const ipRegex = /^(25[0-5]|2[0-4]\d|[01]?\d\d?)(\.(25[0-5]|2[0-4]\d|[01]?\d\d?)){3}$/;

const validarDispositivo = (req, res, next) => {
  const { nombre, ip, estado, tipo } = req.body;


  if (!nombre || nombre.trim() === '') {
    return res.status(400).json({ error: 'El nombre es obligatorio.' });
  }

  if (!ip || !ipRegex.test(ip)) {
    return res.status(400).json({ error: 'IP inválida. Formato esperado: 0-255.0-255.0-255.0-255' });
  }

  if (!tipo || tipo.trim() === '') {
    return res.status(400).json({ error: 'El tipo es obligatorio.' });
  }

  if (estado !== undefined && estado.trim() === '') {
    return res.status(400).json({ error: 'El estado no puede quedar vacío, quite la etiqueta si prefiere su valor por defecto (activo).' });
  }

  next(); 
};

module.exports = validarDispositivo;