const mongoose = require("mongoose");

const logs_registers = new mongoose.Schema({
  user: {
    type: String,
    required: [true, "El usuario es obligatorio."],
  },
  accion: {
    type: String,
    enum: ["UPDATE", "ADD"],
    required: [true, "La acción es obligatoria."],
  },
  modulo: {
    type: String,
    enum: [
      "CARGOS",
      "REGISTROS",
      "FUNCIONARIOS",
      "DOCUMENTOS",
      "ROTACIONES",
      "DEPENDENCIAS",
      "NIVELES",
      "PARTIDAS",
      "UNIDADES",
      "PERMISOS",
    ],
    required: [true, "El módulo es obligatorio."],
  },
  dato_inicial: {
    type: mongoose.Schema.Types.Mixed, // Esto permite almacenar un objeto con campos variados.
    required: function () {
      return this.accion === "UPDATE";
    },
  },
  dato_modificado: {
    type: mongoose.Schema.Types.Mixed,
    required: function () {
      return this.accion === "UPDATE";
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("logs_registers", logs_registers);
