const { Router } = require("express");
const userRoutes = require("./user.route");
const tourRoutes = require("./tour.route");
const reviewRoutes = require("./review.route");
const loginRoutes = require("./login.route");

const routes = Router();

routes.use("/", userRoutes);
// routes.use("/", tourRoutes);
// routes.use("/", reviewRoutes);
routes.use("/", loginRoutes);

module.exports = routes;
