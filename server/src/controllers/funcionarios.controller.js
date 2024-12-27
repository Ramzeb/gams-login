const Funcionario = require("../models/funcionarios.model");
const controller = require("./controller");
const logsController = require("./logs_registers.controller"); // Importar el controlador de logs

async function getElementos(req, res) {
  await controller.getAll(Funcionario, req, res, "funcionarios");
}

async function getElemento(req, res) {
  await controller.getById(Funcionario, req, res, "Funcionario");
}

async function getCampoFiltrado(req, res) {
  await controller.getByFilterCamp(
    Funcionario,
    req,
    res,
    "funcionarios",
    referencia
  );
}

async function getElementoFiltrado(req, res) {
  await controller.getByFilter(Funcionario, req, res, "funcionarios");
}

async function createElemento(req, res) {
  try {
    await controller.create(Funcionario, req, res, "Funcionario");

    // Si la creación fue exitosa, registrar auditoría
    let userRegister = {
      user: req.body.userRegister.user,
      accion: req.body.userRegister.accion,
      modulo: req.body.userRegister.modulo,
      dato_inicial: req.body.userRegister.dato_inicial,
    };
    await logsController.crearRegistroLogs(userRegister);
  } catch {
    //console.error("Error en updateElemento:", error); // Log para depuración
  }
}

async function updateElemento(req, res) {
  const evaluarCampos = [
    "paterno",
    "materno",
    "casada",
    "ext",
    "telefono",
    // "correo",
    // "domicilio.zona",
    // "domicilio.pasaje",
    // "domicilio.calle",
    // "domicilio.numero_casa",
  ];
  try {
    await controller.update(
      Funcionario,
      req,
      res,
      "Funcionario",
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
  await controller.remove(Funcionario, req, res, "Funcionario");
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
