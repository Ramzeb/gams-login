// socket.js
const socketIO = require("socket.io");
let io;
const locks = {}; // Objeto para almacenar los bloqueos de cada solicitud

function initSocket(server) {
  io = socketIO(server, {
    cors: {
      origin: "http://localhost:4200",
      methods: ["GET", "POST"],
    },
  });
  io.on("connection", (socket) => {
    //console.log("Nuevo cliente conectado");
    socket.emit("message", "Bienvenido al servidor");
  });
}

function getIO() {
  if (!io) {
    throw new Error("Socket.io no ha sido inicializado");
  }
  return io;
}

module.exports = { initSocket, getIO };
