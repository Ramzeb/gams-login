const express = require("express");
const router = express.Router();

const { rutas } = require("./routerUtils");
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
} = require("../middlewares/validacionUpdate");

// Rutas para Dependencias
rutas(
  router,
  "dependencia",
  validarDependencia,
  validarActualizacionDependencia
);

// Rutas para Partidas
rutas(router, "partida", validarPartida, validarActualizacionPartida);

// Rutas para Unidades
rutas(router, "unidad", validarUnidad, validarActualizacionUnidad);

// Rutas para Niveles
rutas(router, "nivel", validarNivel, validarActualizacionNivel);

// Rutas para Funcionarios
rutas(
  router,
  "funcionario",
  validarFuncionario,
  validarActualizacionFuncionario
);

// Rutas para Usuarios
rutas(router, "login", validarUsuario, validarActualizacionUsuario);

// Rutas para Cargos
rutas(router, "cargo", validarCargo, validarActualizacionCargo);

// Rutas para Registros
rutas(router, "registro", validarRegistro, validarActualizacionRegistro);

// Rutas para Contenidos
rutas(router, "contenido", validarContenido, validarActualizacionContenido);

module.exports = router;
