// src/controllers/dispositivosController.js
const dispositivoModel = require('../models/dispositivoModel');
const dispositivoView  = require('../views/dispositivoView');

const getAll = async (req, res) => {
  try {
    const { estado } = req.query;
    const data = await dispositivoModel.getAll(estado);
    dispositivoView.success(res, 200, data);
  } catch (error) {
    dispositivoView.error(res, 500, error.message);
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await dispositivoModel.getById(id);
    if (data.length === 0) {
      return dispositivoView.error(res, 404, `Dispositivo con ID ${id} no encontrado.`);
    }
    dispositivoView.success(res, 200, data[0]);
  } catch (error) {
    dispositivoView.error(res, 500, error.message);
  }
};

const create = async (req, res) => {
  try {
    const { nombre, ip, estado, tipo } = req.body;
    const estadoFinal = estado || 'activo';
    const data = await dispositivoModel.create(nombre, ip, estadoFinal, tipo);
    dispositivoView.success(res, 201, data[0]);
  } catch (error) {
    dispositivoView.error(res, 500, error.message);
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, ip, estado, tipo } = req.body;
    const estadoFinal = estado || 'activo';
    const data = await dispositivoModel.update(id, nombre, ip, estadoFinal, tipo);
    if (data.length === 0) {
      return dispositivoView.error(res, 404, `Dispositivo con ID ${id} no encontrado.`);
    }
    dispositivoView.success(res, 200, data[0]);
  } catch (error) {
    dispositivoView.error(res, 500, error.message);
  }
};

const remove = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await dispositivoModel.remove(id);
    if (data.length === 0) {
      return dispositivoView.error(res, 404, `Dispositivo con ID ${id} no encontrado.`);
    }
    dispositivoView.success(res, 200, { mensaje: 'Dispositivo eliminado.', dispositivo: data[0] });
  } catch (error) {
    dispositivoView.error(res, 500, error.message);
  }
};

module.exports = { getAll, getById, create, update, remove };