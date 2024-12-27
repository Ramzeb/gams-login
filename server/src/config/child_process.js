const { exec } = require("child_process");
const path = require("path");

function registrarLogin(userId, status) {
  // Ruta al intérprete de Python dentro de un entorno virtual de linux
  const pythonPath = path.join(__dirname, "ramzeb", "bin", "python");
  // Ruta al intérprete de Python dentro de un entorno virtual de windows
  //const pythonPath = path.join(__dirname, "ramzeb", "Scripts", "python.exe");

  // Ruta al script de Python
  const scriptPath = path.join(__dirname, "get_data.py");

  // Ejecutar el script de Python con el usuario como argumento
  exec(
    `${pythonPath} ${scriptPath} ${userId} ${status}`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error al ejecutar el script: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Error en el script: ${stderr}`);
        return;
      }
      //console.log(`Salida del script: ${stdout}`);
    }
  );
}

module.exports = {
  registrarLogin,
};
