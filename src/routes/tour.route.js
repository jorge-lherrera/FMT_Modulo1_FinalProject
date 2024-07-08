const { Router } = require("express");
const { auth } = require("../middleware/auth");
const TourController = require("../controllers/TourController");

const tourRoutes = new Router();

tourRoutes.get("/passeio", TourController.findAll_tours);
tourRoutes.get("/passeio/avaliacao/:id", auth, TourController.findOne_review);
tourRoutes.post("/passeio", auth, TourController.create_tour);
tourRoutes.post(
  "/passeio/realizado",
  auth,
  TourController.create_usersWhoTookTour
);
tourRoutes.post("/passeio/reserva", auth, TourController.create_booking);
tourRoutes.post("/passeio/avaliacao", auth, TourController.create_review);
tourRoutes.put("/passeio/avaliacao/:id", auth, TourController.update_review);
tourRoutes.delete("/passeio/reserva/:id", auth, TourController.delete_booking);
tourRoutes.delete("/passeio/:id", auth, TourController.delete_tour);
tourRoutes.delete("/passeio/avaliacao/:id", auth, TourController.delete_review);

module.exports = tourRoutes;
