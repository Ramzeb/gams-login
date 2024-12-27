const Partida = require("../models/partidas.model");
const controller = require("./controller");
const logsController = require("./logs_registers.controller"); // Importar el controlador de logs

async function getElementos(req, res) {
  await controller.getAll(Partida, req, res, "partidas");
}

async function getElemento(req, res) {
  await controller.getById(Partida, req, res, "Partida");
}

async function getCampoFiltrado(req, res) {
  await controller.getByFilterCamp(Partida, req, res, "partidas");
}

async function getElementoFiltrado(req, res) {
  await controller.getByFilter(Partida, req, res, "partidas");
}

async function createElemento(req, res) {
  try {
    await controller.create(Partida, req, res, "Partida");
    // Si la creación fue exitosa, registrar auditoría
    let userRegister = {
      user: req.body.userRegister.user,
      accion: req.body.userRegister.accion,
      modulo: req.body.userRegister.modulo,
      dato_inicial: req.body.userRegister.dato_inicial,
    };
    await logsController.crearRegistroLogs(userRegister);
  } catch (error) {
    //console.error("Error en createElemento:", error); // Log para depuración
  }
}

async function updateElemento(req, res) {
  const evaluarCampos = ["monto_refuerzo"];
  try {
    await controller.update(Partida, req, res, "Partida", evaluarCampos);

    // Si la actualización fue exitosa, registrar auditoría
    let userRegister = {
      user: req.body.userRegister.user,
      accion: req.body.userRegister.accion,
      modulo: req.body.userRegister.modulo,
      dato_inicial: req.body.userRegister.dato_inicial,
      dato_modificado: req.body.userRegister.dato_modificado,
    };
    await logsController.crearRegistroLogs(userRegister);
  } catch (error) {
    //console.error("Error en updateElemento:", error); // Log para depuración
  }
}

async function deleteElemento(req, res) {
  await controller.remove(Partida, req, res, "Partida");
}

module.exports = {
  getElementos,
  getElemento,
  getElementoFiltrado,
  getCampoFiltrado,
  createElemento,
  updateElemento,
  deleteElemento,
};
