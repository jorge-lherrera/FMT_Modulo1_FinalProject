const Tour = require("../models/Tour");
const Booking = require("../models/Booking");
const User = require("../models/User");
const Review = require("../models/Review");
const { Sequelize } = require("sequelize");

const {
  tourSchema,
  bookingSchema,
  reviewSchema,
  usersWhoTookTourSchema,
} = require("../middleware/validationSchemas");
const checkUserPermission = require("../middleware/validationUserPermission");
const handleCatchError = require("../middleware/handleCatchErrors");

class TourController {
  async findAll_tours(req, res) {
    /*  
      #swagger.tags = ['Passeios'],
      #swagger.description = 'Endpoint para obter todos os passeios',
      #swagger.responses[200] = {
        description: 'Lista de passeios obtida com sucesso',
        schema: [{
          id: "Id do Passeio",
          tour_title: "Título do passeio",
          description: "Descrição do passeio",
          local: "Localização do passeio",
          price: "Exemplo de preço",
          date: "Exemplo da data 2023-07-06",
          max_number_users: "Exemplo quantidade de usuários",
          user_id: "Id do Usuário"
        }]
      }
      #swagger.responses[500] = {
        description: 'Erro interno do servidor'
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
      #swagger.description = 'Endpoint para obter as avaliações do passeio'
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID do passeio',
        required: true,
        type: 'integer'
      }
      #swagger.responses[200] = {
        description: 'Lista de avaliações obtida com sucesso',
        schema: [{
          id: "Id da avaliação",
          tour_id: "Id do passeio",
          user_id: "Id do usuário",
          scores: "Exemplo de nota",
          comment: "Um comentário"
        }]
      }
      #swagger.responses[404] = {
        description: 'Passeio não encontrado ou sem avaliações'
      }
      #swagger.responses[500] = {
        description: 'Erro interno do servidor'
      }
    */
    try {
      const { id } = req.params;
      const tour = await Tour.findByPk(id);
      if (!tour) {
        return res.status(404).json({ message: "Passeio não existe." });
      }

      const toursReview = await Review.findAll({
        where: { tour_id: id },
      });

      if (toursReview.length === 0) {
        return res
          .status(404)
          .json({ message: "O passeio ainda não tem avaliações." });
      }

      const permission = await checkUserPermission(
        req,
        res,
        id,
        "Tour",
        "findReview"
      );
      if (!permission) return;

      res.json({ message: "Avaliações deste passeio", toursReview });
    } catch (error) {
      handleCatchError(error, res, "findOne_review");
    }
  }

  async create_tour(req, res) {
    /*  
      #swagger.tags = ['Passeios']
      #swagger.description = 'Endpoint para criar um novo passeio'
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Criar um novo passeio',
        required: true,
        schema: {
          $tour_title: "Título do passeio",
          $description: "Descrição do passeio",
          $local: "Localização do passeio",
          $price: "Exemplo de preço",
          $date: "Exemplo da data 2023-07-06",
          $max_number_users: "Exemplo quantidade de usuários",
          $user_id: "Id do Usuário"
        }
      }
      #swagger.responses[201] = {
        description: 'Passeio criado com sucesso',
        schema: {
          message: "Passeio criado com sucesso",
          tour: {
            id: "Id do Passeio",
            tour_title: "Título do passeio",
            description: "Descrição do passeio",
            local: "Localização do passeio",
            price: "Exemplo de preço",
            date: "Exemplo da data 2023-07-06",
            max_number_users: "Exemplo quantidade de usuários",
            user_id: "Id do Usuário"
          }
        }
      }
      #swagger.responses[400] = {
        description: 'Erro de validação ou usuário não encontrado'
      }
      #swagger.responses[500] = {
        description: 'Erro interno do servidor'
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
          message: "Formato correto da data é ANO-MÊS-DIA",
        });
      }

      const user = await User.findByPk(user_id);

      if (!user) {
        return res
          .status(404)
          .json("Passeio deve estar vinculado à um usuário existente");
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
      #swagger.description = 'Endpoint para criar uma nova reserva'
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Criar uma nova reserva',
        required: true,
        schema: {
          $user_id: "Id do Usuário",
          $tour_id: "Id do Passeio"
        }
      }
      #swagger.responses[201] = {
        description: 'Reserva criada com sucesso',
        schema: {
          message: "Reserva criada com sucesso",
          booking: {
            id: 1,
            user_id: "Id do Usuário",
            tour_id: "Id do Passeio"
          }
        }
      }
      #swagger.responses[400] = {
        description: 'Reservas para este passeio estão esgotadas'
      }
      #swagger.responses[404] = {
        description: 'Passeio ou usuário não encontrados'
      }
      #swagger.responses[500] = {
        description: 'Erro interno do servidor'
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
        return res.status(404).json("Passeio ou Usuário não existem");
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
        .json({ message: "Reserva criada com sucesso", create_booking });
    } catch (error) {
      handleCatchError(error, res, "create_booking");
    }
  }

  async create_usersWhoTookTour(req, res) {
    /*  
      #swagger.tags = ['Passeios']
      #swagger.description = 'Endpoint adicionar usuário que realizou o passeio'
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Adicionar usuário que realizou o passeio',
        required: true,
        schema: {
          $user_id: "Id do Usuário",
          $tour_id: "Id do Passeio"
        }
      }
      #swagger.responses[200] = {
        description: 'Sucesso ao adicionar usuário ao passeio'
      }
      #swagger.responses[403] = {
        description: 'Este usuário já realizou este passeio'
      }
      #swagger.responses[404] = {
        description: 'Passeio ou usuário não existem'
      }
      #swagger.responses[500] = {
        description: 'Erro interno do servidor'
      }
    */
    try {
      await usersWhoTookTourSchema.validate(req.body, {
        abortEarly: false,
        strict: true,
      });

      const { user_id, tour_id } = req.body;

      const tour = await Tour.findByPk(tour_id);
      const user = await User.findByPk(user_id);

      if (!tour || !user) {
        return res.status(404).json("Passeio ou Usuário não existem");
      }

      const currentUsersWhoTookTour = tour.usersWhoTookTour_id || [];

      if (currentUsersWhoTookTour.includes(user_id)) {
        return res.status(403).json("Este usuário já realizou este passeio");
      }

      await tour.update({
        usersWhoTookTour_id: Sequelize.literal(
          `array_append("usersWhoTookTour_id", ${user_id})`
        ),
      });

      res.json("Sucesso ao adicionar");
    } catch (error) {
      handleCatchError(error, res, "create_usersWhoTookTour");
    }
  }

  async create_review(req, res) {
    /*  
      #swagger.tags = ['Passeios']
      #swagger.description = 'Endpoint para criar uma avaliação'
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Criar uma nova avaliação',
        required: true,
        schema: {
          $user_id: "Id do Usuário",
          $tour_id: "Id do Passeio",
          $scores: "Exemplo de nota",
          $comment: "Um comentário"
        }
      }
      #swagger.responses[201] = {
        description: 'Avaliação criada com sucesso',
        schema: {
          message: "Avaliação criada com sucesso",
          review: {
            id: "Id da Avaliação",
            user_id: "Id do Usuário",
            tour_id: "Id do Passeio",
            scores: "Exemplo de nota",
            comment: "Um comentário"
          }
        }
      }
      #swagger.responses[404] = {
        description: 'Passeio ou usuário não encontrados'
      }
      #swagger.responses[500] = {
        description: 'Erro interno do servidor'
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
        return res.status(404).json("Passeio ou Usuário não existem");
      }

      if (!tour.usersWhoTookTour_id.includes(user_id)) {
        return res
          .status(403)
          .json(
            "Somente usuários que fizeram o passeio podem criar avaliações"
          );
      }

      const create_review = await Review.create({
        user_id,
        tour_id,
        scores,
        comment,
      });
      res
        .status(201)
        .json({ message: "Avaliação criada com sucesso", create_review });
    } catch (error) {
      handleCatchError(error, res, "create_review");
    }
  }

  async delete_tour(req, res) {
    /*  
      #swagger.tags = ['Passeios']
      #swagger.description = 'Eliminar um passeio por ID'
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID do passeio',
        required: true,
        type: 'integer'
      }
      #swagger.responses[200] = {
        description: 'Passeio eliminado com sucesso',
        schema: {
          message: "Passeio eliminado com sucesso"
        }
      }
      #swagger.responses[404] = {
        description: 'Passeio não encontrado'
      }
      #swagger.responses[403] = {
        description: 'Passeio não pode ser eliminado, pois tem reservas associadas.'
      }
      #swagger.responses[500] = {
        description: 'Erro interno do servidor'
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
            "Passeio não pode ser eliminado, pois tem reservas associadas.",
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
      #swagger.description = 'Eliminar uma reserva por ID'
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'Id da Reserva',
        required: true,
        type: 'integer'
      }
      #swagger.responses[200] = {
        description: 'Reserva eliminada com sucesso',
        schema: {
          message: "Reserva eliminada com sucesso"
        }
      }
      #swagger.responses[404] = {
        description: 'Reserva não encontrada'
      }
      #swagger.responses[500] = {
        description: 'Erro interno do servidor'
      }
    */
    try {
      const { id } = req.params;
      const booking = await Booking.findByPk(id);
      if (!booking) {
        return res.status(404).json({ message: "Reserva não encontrada." });
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
      res.status(200).json({ message: "Reserva eliminada com sucesso." });
    } catch (error) {
      handleCatchError(error, res, "delete_booking");
    }
  }

  async delete_review(req, res) {
    /*  
      #swagger.tags = ['Passeios']
      #swagger.description = 'Eliminar uma avaliação por ID'
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'Id da avaliação',
        required: true,
        type: 'integer'
      }
      #swagger.responses[200] = {
        description: 'Avaliação eliminada com sucesso',
        schema: {
          message: "Avaliação eliminada com sucesso"
        }
      }
      #swagger.responses[404] = {
        description: 'Avaliação não encontrada'
      }
      #swagger.responses[500] = {
        description: 'Erro interno do servidor'
      }
    */
    try {
      const { id } = req.params;
      const review = await Review.findByPk(id);
      if (!review) {
        return res.status(404).json({ message: "Avaliação não encontrada." });
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
      res.status(200).json({ message: "Avaliação eliminada com sucesso." });
    } catch (error) {
      handleCatchError(error, res, "delete_review");
    }
  }

  async update_review(req, res) {
    /*  
      #swagger.tags = ['Passeios']
      #swagger.description = 'Endpoint para atualizar uma avaliação'
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'Id da avaliação',
        required: true,
        type: 'integer'
      }
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Dados para atualizar a avaliação',
        required: true,
        schema: {
          $user_id: "Id do Usuário",
          $tour_id: "Id do Passeio",
          $scores: "Exemplo de nota",
          $comment: "Um comentário"
        }
      }
      #swagger.responses[200] = {
        description: 'Avaliação atualizada com sucesso',
        schema: {
          id: "Id da Avaliação",
          user_id: "Id do Usuário",
          tour_id: "Id do Passeio",
          scores: "Exemplo de nota",
          comment: "Um comentário"
        }
      }
      #swagger.responses[404] = {
        description: 'Avaliação, passeio ou usuário não encontrados'
      }
      #swagger.responses[500] = {
        description: 'Erro interno do servidor'
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
        return res.status(404).json({ message: "Avaliação não encontrada." });
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
            "Não é possível atualizar uma avaliação de um usuário ou de um passeio inexistentes."
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
