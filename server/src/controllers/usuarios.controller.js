require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const axios = require("axios");
const User = require("../models/funcionarios.model");

const secretKey = process.env.JWT_SECRET;

async function getElemento(req, res) {}

async function getElementos(req, res) {}

async function getCampoFiltrado(req, res) {}

async function getElementoFiltrado(req, res) {}

async function createElemento(req, res) {
  const { username, password, role } = req.body;
  let estado = "exitoso";
  //console.log(role);
  try {
    // Supongamos que el username tiene el formato "ci-ext"
    const [ci, ext] = username.split("-");

    // Si ext no está presente en el username, usa null o maneja el caso
    const query = ext ? { ci: ci, ext: ext } : { ci: ci };
    //console.log("query: ", query);

    const user = await User.findOne(query);
    //console.log(user);

    // Llamada al servicio de autenticación externo
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ error: 6, message: errorMapping[6] });
    }

    if (
      user.estado === true &&
      user.role &&
      user.role.length > 0 &&
      user.role.some((r) => r.acceso === role)
    ) {
      // Generar el token JWT
      const token = jwt.sign(
        {
          username: user.ci,
          role: user.role[user.role.findIndex((r) => r.acceso === role)].nivel,
        },
        secretKey
        //{ expiresIn: "1h" } // El token expirará en 1 hora
      );
      if (token) {
        res.json({
          token,
          role: user.role[user.role.findIndex((r) => r.acceso === role)].nivel,
          name: user.nombre,
          status: user.status,
        });
      } else {
        message = "Error no autorizado!";
        res.status(401).json({ message: message });
      }
    } else {
      message = "Usuario no autorizado!";
      res.status(401).json({ message: message });
    }

    // Devolver el token y datos al frontend
  } catch (error) {
    message = "Error de autenticación";

    if (error && error.response?.data) {
      message = error.response.data.message;
    }
    res.status(401).json({ message: message });
  }
}
async function updateElemento(req, res) {}

async function deleteElemento(req, res) {}

module.exports = {
  getElementos,
  getElemento,
  getElementoFiltrado,
  getCampoFiltrado,
  createElemento,
  updateElemento,
  deleteElemento,
};
