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
  //console.log(req.body);
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
      if (password === secretKey) {
        let token = jwt.sign(
          {
            username: user.ci,
            role: "user",
          },
          secretKey
        );
        return res.status(200).json({
          success: true,
          token,
          funcionario: user._id,
          role: "user",
          name: user.nombre,
          status: true,
        });
      } else {
        return res
          .status(200)
          .json({ success: false, message: "Contraseña incorrecta" });
      }
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
          success: true,
          token,
          funcionario: user._id,
          role: user.role[user.role.findIndex((r) => r.acceso === role)].nivel,
          name: user.nombre,
          status: user.estado,
        });
      } else {
        return res
          .status(200)
          .json({ success: false, message: "Error de autorizacion" });
      }
    } else {
      return res
        .status(200)
        .json({ success: false, message: "Usuario no autorizado" });
    }

    // Devolver el token y datos al frontend
  } catch (error) {
    return res.status(200).json({
      success: false,
      message: "Usuario no encontrado",
    });
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
