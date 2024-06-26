const { Router } = require("express");
const LoginController = require("../controllers/LoginController");

const loginRoutes = new Router();

loginRoutes.post("/login", LoginController.login);

module.exports = loginRoutes;
