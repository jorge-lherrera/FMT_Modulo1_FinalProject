const yup = require("yup");
const Tour = require("../models/Tour");
const Booking = require("../models/Booking");
const User = require("../models/User");
const Review = require("../models/Review");

const tourSchema = yup.object().shape({
  tour_title: yup.string().required("O titulo do passeio e obrigatorio"),
  description: yup.string().required("A descripção e obrigatoria"),
  local: yup.string().required("Local e obrigatorio"),
  price: yup.number().required("Preço e obrigatorio"),
  // date: yup.date().required("A data e obrigatoria"),
  max_number_users: yup
    .number()
    .required("Numero maximo de usuarios e obrigatorio"),
  user_id: yup
    .number()
    .required("O id do guia que esta criando o passeio e obrigatorio"),
});

class TourController {
  async findAll(req, res) {
    const tours = await Tour.findAll();
    if (res) {
      res.json(tours);
    } else {
      return tours;
    }
  }
  async findOne_review(req, res) {
    try {
      const { id } = req.params;
      // const tour = await Tour.findByPk(id);
      // if (!tour) {
      //   return res.status(404).json({ message: "Passeio não existe" });
      // }
      const review = await Review.findByPk(id);

      if (!review) {
        res
          .status(404)
          .json({ message: "O passeio ainda não tem avaliações " });
      } else {
        return res.json(review);
      }
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: "Error ao achar a passeio", error: error });
    }
  }
  async create(req, res) {
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

      const tour = await Tour.create({
        tour_title,
        description,
        local,
        price,
        date,
        max_number_users,
        user_id,
      });

      res.status(201).json({ message: "Passeio criado com sucesso", tour });
    } catch (error) {
      console.log(error.message);
      res.status(500).json(error.message);
    }
  }
  async create_booking(req, res) {
    try {
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
        return res.status(400).json({ message: "Tour is fully booked" });
      }

      const create_booking = await Booking.create({
        user_id,
        tour_id,
      });
      res
        .status(201)
        .json({ message: "Reserva criado com sucesso", create_booking });
    } catch (error) {
      console.log(error.message);
      res.status(500).json(error.message);
    }
  }
  async create_review(req, res) {
    try {
      const { user_id, tour_id, scores, comment } = req.body;
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
      console.log(error.message);
      res.status(500).json(error.message);
    }
  }
  async delete(req, res) {
    try {
      const { id } = req.params;
      const tour = await Tour.findByPk(id);
      if (!tour) {
        return res.status(404).json({ message: "Passeio não encontrado" });
      }
      const deleted = await Tour.destroy({
        where: { id },
      });
      res
        .status(200)
        .json({ message: "Passeio eliminado com sucesso", deleted });
    } catch (error) {
      console.log(error.message);
      res
        .status(500)
        .json({ error: "Error ao eliminar a passeio", error: error });
    }
  }
  async delete_booking(req, res) {
    try {
      const { id } = req.params;
      const booking = await Booking.findByPk(id);
      if (!booking) {
        return res.status(404).json({ message: "Reserva não encontrado" });
      }

      const deleted = await Booking.destroy({
        where: { id },
      });
      res
        .status(200)
        .json({ message: "Reserva eliminado com sucesso", deleted });
    } catch (error) {
      console.log(error.message);
      res
        .status(500)
        .json({ error: "Error ao eliminar a reserva", error: error });
    }
  }
  async update_review(req, res) {
    try {
      const { id } = req.params;
      const review = await Review.findByPk(id);

      if (!review) {
        return res.status(404).json({ message: "Avaliação não encontrado!" });
      }
      review.update(req.body);
      await review.save();
      res.json(review);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({
        error: "Não foi possível atualizar a avaliação especificado",
        error: error,
      });
    }
  }
  async delete_review(req, res) {
    try {
      const { id } = req.params;
      const review = await Review.findByPk(id);
      if (!review) {
        return res.status(404).json({ message: "Avaliação não encontrado" });
      }

      const deleted = await Review.destroy({
        where: { id },
      });
      res
        .status(200)
        .json({ message: "Avaliação eliminado com sucesso", deleted });
    } catch (error) {
      console.log(error.message);
      res
        .status(500)
        .json({ error: "Error ao eliminar a avaliação", error: error });
    }
  }
}

module.exports = new TourController();
