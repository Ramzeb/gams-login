const mongoose = require("mongoose");

const contenidoSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, "El titulo es requerido."],
    maxlength: [50, "El titulo no debe exceder los 50 caracteres."],
    uppercase: true,
  },
  encabezado: {
    type: String,
    required: [true, "El encabezado es requerido."],
    maxlength: [50, "El encabezado no debe exceder los 50 caracteres."],
    uppercase: true,
  },
  denominacion: {
    type: String,
    required: [true, "La denominacion es requerido."],
    maxlength: [5, "La denominacion no debe exceder los 5 caracteres."],
    uppercase: true,
  },
  categoria: {
    type: String,
    uppercase: true,
    enum: ["HORA", "FECHA"],
  },
  descripcion: {
    type: String,
    required: [true, "La descripcion es requerido."],
    maxlength: [150, "La descripcion no debe exceder los 150 caracteres."],
    uppercase: true,
  },
  estado: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

contenidoSchema.index({ titulo: 1, estado: 1 });

module.exports = mongoose.model("Contenidos", contenidoSchema);
