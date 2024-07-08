const express = require("express");
const cors = require("cors");
const routes = require("./routes/routes");
const { connection } = require("./database/connection");
const PORT_API = process.env.PORT_API;
const UserController = require("./controllers/UserController");

class Server {
  constructor(server = express()) {
    this.middlewares(server);
    this.database();
    server.use(routes);
    this.initializeServer(server);
  }
  async middlewares(app) {
    app.use(cors());
    app.use(express.json());
  }
  async database() {
    try {
      await connection.authenticate();
      console.log("Conexão bem sucedida");
    } catch (error) {
      console.error("Não foi possível conectar no banco de dados", error);
      throw error;
    }
  }
  async initializeServer(app) {
    app.listen(PORT_API, async () => {
      console.log(`Servidor executando na porta ${PORT_API}`);

      try {
        const usuarios = await UserController.findAll();
        // console.log("Usuarios cadastrados:", usuarios);
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
      }
    });
  }
}

module.exports = { Server };
