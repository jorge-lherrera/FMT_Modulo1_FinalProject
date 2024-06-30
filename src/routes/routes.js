const { Router } = require("express");
const loginRoutes = require("./login.route");
const userRoutes = require("./user.route");
const tourRoutes = require("./tour.route");

const routes = Router();

routes.use("/", loginRoutes);
routes.use("/", userRoutes);
routes.use("/", tourRoutes);

module.exports = routes;
