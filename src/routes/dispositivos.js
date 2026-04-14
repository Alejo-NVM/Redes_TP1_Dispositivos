const { Router } = require('express');
const router = Router();

const { getAll, getById, create, update, remove } = require('../controllers/dispositivosController');
const validarDispositivo = require('../middlewares/validacion');


router.get('/',     getAll);
router.get('/:id',  getById);
router.post('/',    validarDispositivo, create);
router.put('/:id',  validarDispositivo, update);
router.delete('/:id', remove);

module.exports = router;