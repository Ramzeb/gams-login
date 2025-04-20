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
  contenido: require("../controllers/contenidos.controller"),
};

function rutas(router, controlador, validadorCrear, validadorActualizar) {
  // recordar que para agregar una nueva ruta, se debe agregar a todos los controladores la ruta con la funcionalidad, dado  que es una funcionalidad estandarizada para todos los controladores.

  router.get(`/${controlador}`, controladores[controlador].getElementos);
  router.get(`/${controlador}/:id`, controladores[controlador].getElemento);
  router.get(
    `/${controlador}/filtro/:campo/:value`,
    controladores[controlador].getElementoFiltrado
  );
  router.get(
    `/${controlador}/campo/:elemento/:campo/:value`,
    controladores[controlador].getCampoFiltrado
  );
  router.post(
    `/${controlador}`,
    validadorCrear(),
    validarSolicitud,
    controladores[controlador].createElemento
  );
  router.put(
    `/${controlador}/:id`,
    validadorActualizar(),
    validarSolicitud,
    controladores[controlador].updateElemento
  );
  router.delete(
    `/${controlador}/:id`,
    controladores[controlador].deleteElemento
  );
}
module.exports = { rutas };
