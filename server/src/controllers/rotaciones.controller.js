const Rotacion = require("../models/rotaciones.model");
const controller = require("./controller");
const logsController = require("./logs_registers.controller"); // Importar el controlador de logs

const referencia = ["id_registro", "id_cargo_rotacion"];
async function getElementos(req, res) {
  await controller.getAll(Rotacion, req, res, "rotaciones", referencia);
}

async function getElemento(req, res) {
  await controller.getById(Rotacion, req, res, "Rotacion", referencia);
}

async function getCampoFiltrado(req, res) {
  let values = {
    id_registro: 1,
    id_cargo_rotacion: 1,
    detalle: 1,
    estado: 1,
  };
  await controller.getByFilterCamp(
    Rotacion,
    req,
    res,
    "rotaciones",
    referencia,
    values
  );
}

async function getElementoFiltrado(req, res) {
  let reference = [];
  let values = {
    id_registro: 1,
    id_cargo_rotacion: 1,
    descripcion: 1,
    estado: 1,
  };
  await controller.getByFilter(
    Rotacion,
    req,
    res,
    "rotaciones",
    reference,
    values
  );
}

async function createElemento(req, res) {
  try {
    await controller.create(Rotacion, req, res, "Rotacion");

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
  try {
    await controller.update(Rotacion, req, res, "Rotacion");

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
  await controller.remove(Rotacion, req, res, "Rotacion");
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
