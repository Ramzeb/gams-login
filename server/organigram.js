const express = require("express");
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path = require("path");
const database = require("./src/database/config");
const { initSocket } = require("./src/config/socket");

const app = express();
const server = http.createServer(app);
initSocket(server);
const routes = require("./src/routes/router");

// Permite solicitudes de 'localhost:4200' (donde está corriendo Angular)
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret: "secret", resave: true, saveUninitialized: true }));

database.conexion();
app.use(express.static(path.join(__dirname, "../client")));
app.use(routes);
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client", "index.html"));
});

server.listen(process.env.PORT, () => {
  console.log("Servidor activo en puerto ", process.env.PORT);
});
