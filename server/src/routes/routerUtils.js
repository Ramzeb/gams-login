const { validarSolicitud } = require("../middlewares/validacion");

const controladores = {
  dependencia: require("../controllers/dependencias.controller"),
  nivel: require("../controllers/niveles.controller"),
  funcionario: require("../controllers/funcionarios.controller"),
  partida: require("../controllers/partidas.controller"),
  unidad: require("../controllers/unidades.controller"),
  login: require("../controllers/usuarios.controller"),
  cargo: require("../controllers/cargos.controller"),
  registro: require("../controllers/registros.controller"),
  rotacion: require("../controllers/rotaciones.controller"),
  contenido: require("../controllers/contenidos.controller"),
};

function rutas(
  router,
  controlador,
  validadorCrear,
  validadorActualizar,
  middlewares = []
) {
  // Función para aplicar los middlewares de forma dinámica
  const aplicarMiddlewares = (rutaMiddlewares) => [
    ...middlewares,
    ...rutaMiddlewares,
  ];

  router.get(
    `/${controlador}`,
    aplicarMiddlewares([]),
    controladores[controlador].getElementos
  );
  router.get(
    `/${controlador}/:id`,
    aplicarMiddlewares([]),
    controladores[controlador].getElemento
  );
  router.get(
    `/${controlador}/filtro/:campo/:value`,
    aplicarMiddlewares([]),
    controladores[controlador].getElementoFiltrado
  );
  router.get(
    `/${controlador}/campo/:elemento/:campo/:value`,
    aplicarMiddlewares([]),
    controladores[controlador].getCampoFiltrado
  );
  router.post(
    `/${controlador}`,
    controlador === "login"
      ? [validadorCrear(), validarSolicitud] // sin token
      : aplicarMiddlewares([validadorCrear(), validarSolicitud]),
    controladores[controlador].createElemento
  );

  router.put(
    `/${controlador}/:id`,
    aplicarMiddlewares([validadorActualizar(), validarSolicitud]),
    controladores[controlador].updateElemento
  );
  router.delete(
    `/${controlador}/:id`,
    aplicarMiddlewares([]),
    controladores[controlador].deleteElemento
  );
}
module.exports = { rutas };
