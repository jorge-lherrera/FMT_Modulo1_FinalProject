const Tour = require("../models/Tour");
const Booking = require("../models/Booking");
const User = require("../models/User");
const Review = require("../models/Review");
const {
  tourSchema,
  bookingSchema,
  reviewSchema,
} = require("../middleware/validationSchemas");
const checkUserPermission = require("../middleware/validationUserPermission");
const handleCatchError = require("../middleware/handleCatchErrors");

class TourController {
  async findAll_tours(req, res) {
    /*  
            #swagger.tags = ['Passeios'],
            #swagger.description = 'Endpoint para obtener todos los passeio'
            #swagger.responses[200] = {
            description: 'Lista de passeios obtenida con éxito',
            schema: [{
        id: "Passeio id",
          tour_title: "Título del paseo",
          description: "Descripción del paseo",
          local: "Localización del paseo",
          price: 100.0,
          date: "2023-07-06",
          max_number_users: 20,
          user_id: "Usuario id"
            }]
        }
             #swagger.responses[500] = {
            description: 'Error interno del servidor'
        }
    */
    try {
      const tours = await Tour.findAll();
      if (res) {
        return res.json(tours);
      }
      return tours;
    } catch (error) {
      handleCatchError(error, res, "findAll_tours");
    }
  }
  async findOne_review(req, res) {
    /*  
      #swagger.tags = ['Passeios']
      #swagger.description = 'Endpoint para obtener las evaluaciones de un paseo'
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID del paseo',
        required: true,
        type: 'integer'
      }
      #swagger.responses[200] = {
        description: 'Lista de evaluaciones obtenida con éxito',
        schema: [{
          id: 1,
          tour_id: 1,
          user_id: 1,
          scores: 5,
          comment: "Excelente paseo"
        }]
      }
      #swagger.responses[404] = {
        description: 'Paseo no encontrado o sin evaluaciones'
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
    */
    try {
      const { id } = req.params;
      const tour = await Tour.findByPk(id);
      if (!tour) {
        return res.status(404).json({ message: "Passeio não existe" });
      }

      const toursReview = await Review.findAll({
        where: { tour_id: id },
      });

      if (toursReview.length === 0) {
        return res
          .status(404)
          .json({ message: "O passeio ainda não tem avaliações " });
      }

      const permission = await checkUserPermission(
        req,
        res,
        id,
        "Tour",
        "findReview"
      );
      if (!permission) return;

      res.json({ message: "Avaliações de este passeio", toursReview });
    } catch (error) {
      handleCatchError(error, res, "findOne_review");
    }
  }
  async create_tour(req, res) {
    /*  
      #swagger.tags = ['Passeios']
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Crear un nuevo paseo',
        required: true,
        schema: {
          $tour_title: "Título del paseo",
          $description: "Descripción del paseo",
          $local: "Localización del paseo",
          $price: 100.0,
          $date: "2023-07-06",
          $max_number_users: 20,
          $user_id: 1
        }
      }
      #swagger.responses[201] = {
        description: 'Paseo creado con éxito',
        schema: {
          message: "Paseo creado con éxito",
          tour: {
            id: 1,
            tour_title: "Título del paseo",
            description: "Descripción del paseo",
            local: "Localización del paseo",
            price: 100.0,
            date: "2023-07-06",
            max_number_users: 20,
            user_id: 1
          }
        }
      }
      #swagger.responses[400] = {
        description: 'Error de validación o usuario no encontrado'
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
    */
    try {
      await tourSchema.validate(req.body, {
        abortEarly: false,
        strict: true,
      });

      const {
        tour_title,
        description,
        local,
        price,
        date,
        max_number_users,
        user_id,
      } = req.body;

      if (!date.match(/\d{4}-\d{2}-\d{2}/gm)) {
        return res.status(400).json({
          message: "Formato correto da data de nascimento e ANO-MES-DIA",
        });
      }

      const user = await User.findByPk(user_id);

      if (!user) {
        return res
          .status(404)
          .json("Passeio deve estar vinculado a um usuario existente");
      }

      const create_tour = await Tour.create({
        tour_title,
        description,
        local,
        price,
        date,
        max_number_users,
        user_id,
      });

      res
        .status(201)
        .json({ message: "Passeio criado com sucesso", create_tour });
    } catch (error) {
      handleCatchError(error, res, "create_tour");
    }
  }
  async create_booking(req, res) {
    /*  
      #swagger.tags = ['Passeios']
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Crear una nueva reserva',
        required: true,
        schema: {
          $user_id: 1,
          $tour_id: 1
        }
      }
      #swagger.responses[201] = {
        description: 'Reserva creada con éxito',
        schema: {
          message: "Reserva creada con éxito",
          booking: {
            id: 1,
            user_id: 1,
            tour_id: 1
          }
        }
      }
      #swagger.responses[400] = {
        description: 'Reservas para este paseo están agotadas'
      }
      #swagger.responses[404] = {
        description: 'Paseo o usuario no encontrado'
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
    */
    try {
      await bookingSchema.validate(req.body, {
        abortEarly: false,
        strict: true,
      });
      const { user_id, tour_id } = req.body;
      const tour = await Tour.findByPk(tour_id);
      const user = await User.findByPk(user_id);

      if (!tour || !user) {
        return res.status(404).json("Passeio ou Usuario não existe");
      }

      const booking = await Booking.findAndCountAll({
        where: { tour_id },
      });

      if (booking.count >= tour.max_number_users) {
        return res
          .status(400)
          .json("As reservas para este passeio estão esgotadas");
      }

      const create_booking = await Booking.create({
        user_id,
        tour_id,
      });
      res
        .status(201)
        .json({ message: "Reserva criado com sucesso", create_booking });
    } catch (error) {
      handleCatchError(error, res, "create_booking");
    }
  }
  async create_review(req, res) {
    /*  
      #swagger.tags = ['Passeios']
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Crear una nueva evaluación',
        required: true,
        schema: {
          $user_id: 1,
          $tour_id: 1,
          $scores: 5,
          $comment: "Comentario sobre el paseo"
        }
      }
      #swagger.responses[201] = {
        description: 'Evaluación creada con éxito',
        schema: {
          message: "Evaluación creada con éxito",
          review: {
            id: 1,
            user_id: 1,
            tour_id: 1,
            scores: 5,
            comment: "Comentario sobre el paseo"
          }
        }
      }
      #swagger.responses[404] = {
        description: 'Paseo o usuario no encontrado'
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
    */
    try {
      await reviewSchema.validate(req.body, {
        abortEarly: false,
        strict: true,
      });
      const { user_id, tour_id, scores, comment } = req.body;

      const tour = await Tour.findByPk(tour_id);
      const user = await User.findByPk(user_id);

      if (!tour || !user) {
        return res.status(404).json("Passeio ou Usuario não existe");
      }

      const create_review = await Review.create({
        user_id,
        tour_id,
        scores,
        comment,
      });
      res
        .status(201)
        .json({ message: "Avaliação criado com sucesso", create_review });
    } catch (error) {
      handleCatchError(error, res, "create_review");
    }
  }
  async delete_tour(req, res) {
    /*  
      #swagger.tags = ['Passeios']
      #swagger.description = 'Eliminar un paseo por ID'
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID del paseo',
        required: true,
        type: 'integer'
      }
      #swagger.responses[200] = {
        description: 'Paseo eliminado con éxito',
        schema: {
          message: "Paseo eliminado con éxito"
        }
      }
      #swagger.responses[404] = {
        description: 'Paseo no encontrado'
      }
      #swagger.responses[403] = {
        description: 'Paseo no puede ser eliminado, pues tiene reservas asociadas'
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
    */
    try {
      const { id } = req.params;

      const tour = await Tour.findByPk(id);
      if (!tour) {
        return res.status(404).json({ message: "Passeio não encontrado" });
      }
      const tourBookings = await Booking.findAll({
        where: { tour_id: id },
      });

      if (tourBookings.length > 0) {
        return res.status(403).json({
          message:
            "Passeio não pode ser eliminado, pois tem reservas associadas!",
        });
      }

      const permission = await checkUserPermission(
        req,
        res,
        id,
        "Tour",
        "deleteTour"
      );
      if (!permission) return;

      await Tour.destroy({
        where: { id },
      });
      res.status(200).json({ message: "Passeio eliminado com sucesso" });
    } catch (error) {
      handleCatchError(error, res, "delete_tour");
    }
  }
  async delete_booking(req, res) {
    /*  
      #swagger.tags = ['Passeios']
      #swagger.description = 'Eliminar una reserva por ID'
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID de la reserva',
        required: true,
        type: 'integer'
      }
      #swagger.responses[200] = {
        description: 'Reserva eliminada con éxito',
        schema: {
          message: "Reserva eliminada con éxito"
        }
      }
      #swagger.responses[404] = {
        description: 'Reserva no encontrada'
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
    */
    try {
      const { id } = req.params;
      const booking = await Booking.findByPk(id);
      if (!booking) {
        return res.status(404).json({ message: "Reserva não encontrado" });
      }

      const permission = await checkUserPermission(
        req,
        res,
        id,
        "Booking",
        "deleteBooking"
      );
      if (!permission) return;

      await Booking.destroy({
        where: { id },
      });
      res.status(200).json({ message: "Reserva eliminado com sucesso" });
    } catch (error) {
      handleCatchError(error, res, "delete_booking");
    }
  }
  async delete_review(req, res) {
    /*  
      #swagger.tags = ['Passeios']
      #swagger.description = 'Eliminar una evaluación por ID'
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID de la evaluación',
        required: true,
        type: 'integer'
      }
      #swagger.responses[200] = {
        description: 'Evaluación eliminada con éxito',
        schema: {
          message: "Evaluación eliminada con éxito"
        }
      }
      #swagger.responses[404] = {
        description: 'Evaluación no encontrada'
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
    */
    try {
      const { id } = req.params;
      const review = await Review.findByPk(id);
      if (!review) {
        return res.status(404).json({ message: "Avaliação não encontrado" });
      }

      const permission = await checkUserPermission(
        req,
        res,
        id,
        "Review",
        "deleteReview"
      );
      if (!permission) return;

      await Review.destroy({
        where: { id },
      });
      res.status(200).json({ message: "Avaliação eliminado com sucesso" });
    } catch (error) {
      handleCatchError(error, res, "delete_review");
    }
  }
  async update_review(req, res) {
    /*  
      #swagger.tags = ['Passeios']
      #swagger.description = 'Actualizar una evaluación por ID'
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID de la evaluación',
        required: true,
        type: 'integer'
      }
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Datos para actualizar la evaluación',
        required: true,
        schema: {
          $user_id: 1,
          $tour_id: 1,
          $scores: 5,
          $comment: "Comentario actualizado sobre el paseo"
        }
      }
      #swagger.responses[200] = {
        description: 'Evaluación actualizada con éxito',
        schema: {
          id: 1,
          user_id: 1,
          tour_id: 1,
          scores: 5,
          comment: "Comentario actualizado sobre el paseo"
        }
      }
      #swagger.responses[404] = {
        description: 'Evaluación, paseo o usuario no encontrado'
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
    */
    try {
      await reviewSchema.validate(req.body, {
        abortEarly: false,
        strict: true,
      });

      const { id } = req.params;
      const review = await Review.findByPk(id);

      if (!review) {
        return res.status(404).json({ message: "Avaliação não encontrado!" });
      }

      const { user_id, tour_id } = req.body;

      const tour = await Tour.findOne({
        where: { id: tour_id },
      });
      const user = await User.findOne({
        where: { id: user_id },
      });

      if (!tour || !user) {
        return res
          .status(404)
          .json(
            "Não se pode atualizar uma avaliação de usuario o passeio que não existe"
          );
      }

      const permission = await checkUserPermission(
        req,
        res,
        id,
        "Review",
        "updateReview"
      );
      if (!permission) return;

      await review.update(req.body);
      await review.save();
      res.json(review);
    } catch (error) {
      handleCatchError(error, res, "update_review");
    }
  }
}

module.exports = new TourController();
