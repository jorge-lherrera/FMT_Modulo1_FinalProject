const { Router } = require("express");
const { auth } = require("../middleware/auth");
const UserController = require("../controllers/UserController");

const userRoutes = new Router();

userRoutes.post("/usuario", UserController.create);
userRoutes.delete("/usuario/:id", auth, UserController.delete);

module.exports = userRoutes;
