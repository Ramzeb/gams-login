const logs_registers = require("../models/logs_registers.model");

async function crearRegistroLogs(userRegister) {
  try {
    const registro = new logs_registers(userRegister);
    await registro.save();
    return {
      success: true,
      message: "Registro de auditoría guardado con éxito",
    };
  } catch (error) {
    return {
      success: false,
      message: "Error al guardar el registro de auditoría",
      error,
    };
  }
}

async function obtenerRegistroLogs(req, res) {
  try {
    const logs = await logs_registers.find();
    res.json({ success: true, logs });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error al obtener auditorías", error });
  }
}

module.exports = {
  crearRegistroLogs,
  obtenerRegistroLogs,
};
