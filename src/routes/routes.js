const { Router } = require("express");
const loginRoutes = require("./login.route");
const userRoutes = require("./user.route");
const tourRoutes = require("./tour.route");

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const routes = Router();

routes.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
routes.use("/", loginRoutes);
routes.use("/", userRoutes);
routes.use("/", tourRoutes);

module.exports = routes;
