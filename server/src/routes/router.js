const express = require("express");
const router = express.Router();

const { rutas } = require("./routerUtils");
const validacionToken = require("../middlewares/validacionToken"); // Importa el middleware de verificación

const {
  validarPartida,
  validarDependencia,
  validarUnidad,
  validarNivel,
  validarFuncionario,
  validarUsuario,
  validarCargo,
  validarRegistro,
  validarContenido,
  validarRotacion,
} = require("../middlewares/validacionCreate");
const {
  validarActualizacionPartida,
  validarActualizacionDependencia,
  validarActualizacionUnidad,
  validarActualizacionNivel,
  validarActualizacionFuncionario,
  validarActualizacionUsuario,
  validarActualizacionCargo,
  validarActualizacionRegistro,
  validarActualizacionContenido,
  validarActualizacionRotacion,
} = require("../middlewares/validacionUpdate");

// Rutas para Dependencias
rutas(
  router,
  "dependencia",
  validarDependencia,
  validarActualizacionDependencia,
  [validacionToken]
);

// Rutas para Partidas
rutas(router, "partida", validarPartida, validarActualizacionPartida, [
  validacionToken,
]);

// Rutas para Unidades
rutas(router, "unidad", validarUnidad, validarActualizacionUnidad, [
  validacionToken,
]);

// Rutas para Niveles
rutas(router, "nivel", validarNivel, validarActualizacionNivel, [
  validacionToken,
]);

// Rutas para Funcionarios
rutas(
  router,
  "funcionario",
  validarFuncionario,
  validarActualizacionFuncionario,
  [validacionToken]
);

// Rutas para Usuarios
rutas(router, "login", validarUsuario, validarActualizacionUsuario, [
  validacionToken,
]);

// Rutas para Cargos
rutas(router, "cargo", validarCargo, validarActualizacionCargo, [
  validacionToken,
]);

// Rutas para Registros
rutas(router, "registro", validarRegistro, validarActualizacionRegistro, [
  validacionToken,
]);

// Rutas para Contenidos
rutas(router, "contenido", validarContenido, validarActualizacionContenido, [
  validacionToken,
]);

// Rutas para Rotaciones
rutas(router, "rotacion", validarRotacion, validarActualizacionRotacion, [
  validacionToken,
]);

module.exports = router;
