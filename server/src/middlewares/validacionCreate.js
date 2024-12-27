const { validarCampo } = require("./validacion");
const Partida = require("../models/partidas.model");
const Nivel = require("../models/niveles.model");
const Dependencia = require("../models/dependencias.model");
const Unidad = require("../models/unidades.model");
const Funcionario = require("../models/funcionarios.model");
const Registro = require("../models/registros.model");
const Usuario = require("../models/usuarios.model");

//Una dependencia tiene una sigla que no se repite en ninguna otra.
function validarDependencia(requerido = true, actualizar = false) {
  return [
    validarCampo("nombre", { requerido, longitudMaxima: 150 }),
    validarCampo("sigla", {
      requerido,
      longitudMaxima: 10,
      existeEnBD: Dependencia,
      actualizar,
    }),
    validarCampo("tipo", {
      requerido,
      lista: ["JEFATURA", "SECRETARIA", "DIRECCION"],
    }),
    validarCampo("estado", { requerido: false, tipoBooleano: true }),
    validarCampo("id_dependencia", { requerido: false, tipoMongoId: true }),
  ];
}

function validarUnidad(requerido = true, actualizar = false) {
  return [
    validarCampo("nombre", {
      requerido,
      longitudMaxima: 150,
      existeValues: Unidad,
      actualizar,
    }),
    validarCampo("clasificacion", {
      requerido,
      lista: ["SUSTANTIVO", "ADMINISTRATIVO"],
    }),
    validarCampo("estado", { requerido: false, tipoBooleano: true }),
    validarCampo("id_dependencia", { requerido, tipoMongoId: true }),
    validarCampo("id_cargo", {
      requerido: false,
      tipoMongoId: true,
    }),
  ];
}

function validarPartida(requerido = true, actualizar = false) {
  return [
    validarCampo("nombre", { requerido, longitudMaxima: 100 }),
    // validarCampo("gestion", { requerido, formatoFecha: true }),
    validarCampo("codigo", {
      requerido,
      tipoEntero: true,
      minNumero: 10000,
      longitudMaxima: 8,
      existeValues: Partida,
      actualizar,
    }),
    validarCampo("fuente", {
      requerido,
      tipoEntero: true,
      minNumero: 1,
      longitudMaxima: 3,
    }),
    validarCampo("organismo", {
      requerido,
      tipoEntero: true,
      minNumero: 1,
      longitudMaxima: 4,
    }),
    validarCampo("monto_asignado", {
      requerido,
      tipoNumero: true,
      minNumero: 1,
    }),
    validarCampo("monto_refuerzo", {
      requerido: false,
      tipoNumero: true,
      minNumero: 1,
    }),
    validarCampo("tipo", { requerido: false, longitudMaxima: 50 }),
    validarCampo("estado", { requerido: false, tipoBooleano: true }),
    // validarCampo("id_gestion", { requerido: false, tipoMongoId: true }),
  ];
}

function validarNivel(requerido = true, actualizar = false) {
  return [
    validarCampo("nombre", {
      requerido,
      tipoEntero: true,
      minNumero: 1,
      longitudMaxima: 2,
      existeValues: Nivel,
      actualizar,
    }),
    validarCampo("haber_basico", {
      requerido,
      tipoNumero: true,
      minNumero: 1,
    }),
    validarCampo("cns", {
      requerido: false,
      tipoNumero: true,
      minNumero: 0.0001,
    }),
    validarCampo("solidario", {
      requerido: false,
      tipoNumero: true,
      minNumero: 0.0001,
    }),
    validarCampo("provivienda", {
      requerido: false,
      tipoNumero: true,
      minNumero: 0.0001,
    }),
    validarCampo("afp", {
      requerido: false,
      tipoNumero: true,
      minNumero: 0.0001,
    }),
    validarCampo("estado", { requerido: false, tipoBooleano: true }),
    validarCampo("id_descuento", { requerido: false, tipoMongoId: true }),
  ];
}

function validarFuncionario(requerido = true, actualizar = false) {
  return [
    validarCampo("nombre", { requerido, longitudMaxima: 20 }),
    validarCampo("paterno", { requerido: false, longitudMaxima: 20 }),
    validarCampo("materno", { requerido: false, longitudMaxima: 20 }),
    validarCampo("casada", { requerido: false, longitudMaxima: 50 }),
    validarCampo("ci", {
      requerido,
      tipoEntero: true,
      minNumero: 1000,
      longitudMaxima: 10,
      existeCI: Funcionario,
      actualizar,
    }),
    validarCampo("ext", {
      requerido: false,
      longitudMinima: 1,
      longitudMaxima: 2,
    }),
    // validarCampo("expedido", {
    //   requerido: false,
    //   lista: ["LP", "SC", "CB", "PT", "OR", "TJ", "CH", "BN", "PA"],
    // }),
    validarCampo("genero", { requerido, lista: ["M", "F"] }),
    validarCampo("fecha_nacimiento", { requerido, formatoFecha: true }),
    validarCampo("telefono", {
      requerido: false,
      tipoEntero: true,
      minNumero: 1000000,
      longitudMaxima: 10,
    }),
    validarCampo("correo", {
      requerido: false,
      tipoEmail: true,
      longitudMaxima: 35,
    }),
    validarCampo("domicilio.distrito", {
      requerido: false,
      longitudMaxima: 50,
    }),
    validarCampo("domicilio.zona", { requerido: false, longitudMaxima: 50 }),
    validarCampo("domicilio.pasaje", { requerido: false, longitudMaxima: 50 }),
    validarCampo("domicilio.calle", { requerido: false, longitudMaxima: 50 }),
    validarCampo("domicilio.numero_casa", {
      requerido: false,
      tipoEntero: true,
      minNumero: 1,
      longitudMaxima: 5,
    }),
    // validarCampo("domicilio.telefono_casa", {
    //   requerido: false,
    //   tipoEntero: true,
    //   minNumero: 1111111,
    //   longitudMaxima: 10,
    // }),
    validarCampo("estado", { requerido: false, tipoBooleano: true }),
    validarCampo("password", { requerido: false }),
    validarCampo("role", { requerido: false }),
  ];
}

function validarUsuario(requerido = true, actualizar = false) {
  return [];
  //   return [
  //     validarCampo("tipo", {
  //       requerido,
  //       enum: ["FUNCIONARIO", "VISITANTE", "USUARIO", "ADMINISTRADOR"],
  //     }),
  //     validarCampo("username", {
  //       requerido,
  //       longitudMinima: 6,
  //       longitudMaxima: 15,
  //       existeValues: Usuario,
  //       actualizar,
  //     }),
  //     validarCampo("password", {
  //       requerido,
  //       longitudMinima: 6,
  //       longitudMaxima: 15,
  //     }),
  //     validarCampo("estado", { requerido: false, tipoBooleano: true }),
  //     validarCampo("id_funcionario", { tipoMongoId: true }),
  //     validarCampo("id_usuario", { tipoMongoId: true }),
  //   ];
}

function validarCargo(requerido = true /*, actualizar = false*/) {
  return [
    validarCampo("nombre", {
      requerido,
      longitudMaxima: 100,
    }),
    validarCampo("denominacion", { requerido: false, longitudMaxima: 50 }),
    validarCampo("contrato", {
      requerido,
      lista: ["ITEM", "EVENTUAL", "REMANENTE"],
    }),
    validarCampo("categoria", {
      requerido: false,
      lista: ["SUPERIOR", "EJECUTIVO", "OPERATIVO"],
    }),
    validarCampo("clasificacion", { requerido: false, longitudMaxima: 15 }),
    validarCampo("clase", { requerido: false, longitudMaxima: 10 }),
    validarCampo("rotacion", { requerido: false, tipoBooleano: true }),
    validarCampo("registro", {
      requerido,
      tipoEntero: true,
      minNumero: 1,
      longitudMaxima: 5,
      //   existeValues: Cargo,
      //   actualizar,
    }),
    validarCampo("duracion_contrato", {
      requerido: false,
      tipoEntero: true,
      minNumero: 1,
      longitudMaxima: 3,
    }),
    validarCampo("objetivo", {
      requerido: false,
      longitudMaxima: 300,
    }),
    validarCampo("estado", { requerido: false, tipoBooleano: true }),
    validarCampo("id_partida", {
      requerido: false,
      tipoMongoId: true,
    }),
    validarCampo("id_nivel_salarial", {
      requerido,
      tipoMongoId: true,
    }),
    validarCampo("id_dependencia", {
      requerido,
      tipoMongoId: true,
    }),
    validarCampo("id_unidad", {
      requerido: false,
      tipoMongoId: true,
    }),
    validarCampo("cargo_principal", { requerido, tipoBooleano: true }),
    validarCampo("id_cargo_superior", {
      requerido: false,
      tipoMongoId: true,
    }),
    validarCampo("id_cargo_dependiente", {
      requerido: false,
      tipoMongoId: true,
    }),
    validarCampo("id_usuario", {
      requerido: false,
      tipoMongoId: true,
    }),
  ];
}

function validarRegistro(requerido = true, actualizar = false) {
  return [
    validarCampo("tipo", {
      requerido: false,
      lista: [
        "RENUNCIA",
        "RESOLUCION",
        "ROTACION",
        "REASIGNACION",
        "ASCENSO",
        "AGRADECIMIENTO",
      ],
    }),
    validarCampo("fecha_baja", { requerido: false }),
    validarCampo("fecha_ingreso", { requerido, formatoFecha: true }),
    validarCampo("fecha_conclusion", { requerido, formatoFecha: true }),
    validarCampo("tipo_contrato", {
      requerido: false,
      lista: ["MD", "MR", "MA", "CAPE"],
    }),
    validarCampo("cite", { requerido: false, longitudMaxima: 50 }),
    validarCampo("numero_contrato", { requerido: false, longitudMaxima: 10 }),
    validarCampo("historico", {
      requerido: false,
      tipoArray: true,
      actualizar,
    }),
    validarCampo("descripcion", {
      requerido: false,
      longitudMaxima: 100,
    }),
    validarCampo("estado", { requerido: false, tipoBooleano: true }),
    validarCampo("id_secretaria_contratante", {
      requerido: false,
      tipoMongoId: true,
    }),
    validarCampo("id_funcionario", {
      requerido,
      tipoMongoId: true,
      existeValues: Registro,
    }),
    validarCampo("id_cargo", { requerido, tipoMongoId: true }),
  ];
}

module.exports = {
  validarDependencia,
  validarUnidad,
  validarPartida,
  validarNivel,
  validarFuncionario,
  validarUsuario,
  validarCargo,
  validarRegistro,
};
