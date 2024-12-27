const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
  tipo: {
    type: String,
    required: [true, "El campo tipo es requerido."],
    enum: ["FUNCIONARIO", "VISITANTE", "USUARIO", "ADMINISTRADOR"],
    uppercase: true,
  },
  username: {
    type: String,
    required: [true, "El campo username es requerido."],
    minlength: [6, "El campo username debe contener almenos 6 caracteres."],
    maxlength: [15, "El username no debe contener más de 15 caracteres"],
    uppercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: [6, "El campo username debe contener almenos 6 caracteres."],
    maxlength: [15, "El username no debe contener más de 15 caracteres"],
  },
  estado: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  id_funcionario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Funcionarios",
  },
});

module.exports = mongoose.model("Usuarios", usuarioSchema);
