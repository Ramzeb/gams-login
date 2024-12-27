// dependencia.controller.js
const Dependencia = require("../models/dependencias.model");
const controller = require("./controller");
const logsController = require("./logs_registers.controller"); // Importar el controlador de logs

async function getElementos(req, res) {
  const referencia = ["id_dependencia"];
  await controller.getAll(Dependencia, req, res, "dependencias", referencia);
}

async function getElemento(req, res) {
  const referencia = ["id_dependencia"];
  await controller.getById(Dependencia, req, res, "Dependencia", referencia);
}

async function getCampoFiltrado(req, res) {
  const referencia = ["id_dependencia"];
  await controller.getByFilterCamp(
    Dependencia,
    req,
    res,
    "dependencias",
    referencia
  );
}

async function getElementoFiltrado(req, res) {
  const referencia = ["id_dependencia"];
  await controller.getByFilter(
    Dependencia,
    req,
    res,
    "Dependencia",
    referencia
  );
}

async function createElemento(req, res) {
  try {
    await controller.create(Dependencia, req, res, "Dependencia"); // Si la creación fue exitosa, registrar auditoría
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
  const evaluarCampos = ["id_dependencia"];
  try {
    await controller.update(
      Dependencia,
      req,
      res,
      "Dependencia",
      evaluarCampos
    );

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
  await controller.remove(Dependencia, req, res, "Dependencia");
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
