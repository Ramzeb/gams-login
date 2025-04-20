const Contenido = require("../models/contenidos.model");
const controller = require("./controller");
const logsController = require("./logs_registers.controller"); // Importar el controlador de logs

async function getElementos(req, res) {
  await controller.getAll(Contenido, req, res, "contenidos");
}

async function getElemento(req, res) {
  await controller.getById(Contenido, req, res, "Contenido");
}

async function getCampoFiltrado(req, res) {
  await controller.getByFilterCamp(Contenido, req, res, "contenidos");
}

async function getElementoFiltrado(req, res) {
  await controller.getByFilter(Contenido, req, res, "contenidos");
}

async function createElemento(req, res) {
  try {
    await controller.create(Contenido, req, res, "Contenido");

    // Si la creación fue exitosa, registrar auditoría
    // let userRegister = {
    //   user: req.body.userRegister.user,
    //   accion: req.body.userRegister.accion,
    //   modulo: req.body.userRegister.modulo,
    //   dato_inicial: req.body.userRegister.dato_inicial,
    // };
    // await logsController.crearRegistroLogs(userRegister);
  } catch (error) {
    //console.error("Error en createElemento:", error); // Log para depuración
  }
}

async function updateElemento(req, res) {
  try {
    await controller.update(Contenido, req, res, "Contenido");
    // Si la actualización fue exitosa, registrar auditoría
    // let userRegister = {
    //   user: req.body.userRegister.user,
    //   accion: req.body.userRegister.accion,
    //   modulo: req.body.userRegister.modulo,
    //   dato_inicial: req.body.userRegister.dato_inicial,
    //   dato_modificado: req.body.userRegister.dato_modificado,
    // };
    // await logsController.crearRegistroLogs(userRegister);
  } catch (error) {
    //console.error("Error en updateElemento:", error); // Log para depuración
  }
}

async function deleteElemento(req, res) {
  await controller.remove(Contenido, req, res, "Contenido");
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
