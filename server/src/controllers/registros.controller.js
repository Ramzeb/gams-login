const Registro = require("../models/registros.model");
const controller = require("./controller");
const logsController = require("./logs_registers.controller"); // Importar el controlador de logs

async function getElementos(req, res) {
  const referencia = ["id_funcionario", "id_cargo", "historico.id_cargo"];
  await controller.getAll(Registro, req, res, "registros", referencia);
}

async function getElemento(req, res) {
  const referencia = ["id_cargo", "historico.id_cargo"];
  await controller.getById(Registro, req, res, "Registro", referencia);
}

async function getCampoFiltrado(req, res) {
  const referencia = ["id_cargo", "historico.id_cargo"];
  await controller.getByFilterCamp(Registro, req, res, "registros");
}

async function getElementoFiltrado(req, res) {
  const referencia = ["id_funcionario", "id_cargo", "historico.id_cargo"];
  await controller.getByFilter(Registro, req, res, "registros", referencia);
}

async function createElemento(req, res) {
  try {
    await controller.create(Registro, req, res, "Registro");

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
  const evaluarCampos = ["cargo", "abreviatura"];
  try {
    await controller.update(Registro, req, res, "Registro", evaluarCampos);

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
  await controller.remove(Registro, req, res, "Registro");
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
