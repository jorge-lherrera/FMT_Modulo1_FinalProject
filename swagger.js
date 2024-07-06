const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "TRIP 365",
    description: "API de MVP projeto final modulo 1, curso FMT",
    version: "1.0.0",
  },
  host: "localhost:3000",
  security: [{ apiKeyAuth: [] }],
  securityDefinitions: {
    apiKeyAuth: {
      type: "apiKey",
      in: "header",
      name: "authorization",
      description: "Token de Autenticação",
    },
  },
};

const outputFile = "./src/routes/swagger.json";
const routes = ["./src/server.js"];

swaggerAutogen(outputFile, routes, doc);
