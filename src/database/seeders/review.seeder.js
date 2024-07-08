const { QueryInterface, Sequelize } = require("sequelize");
const Review = require("../../models/Review");
const { Op } = Sequelize;

module.exports = {
  up: async (QueryInterface, Sequelize) => {
    await Review.bulkCreate([
      {
        user_id: 2,
        tour_id: 2,
        scores: 3,
        comment: "um comentario",
      },
      {
        user_id: 2,
        tour_id: 2,
        scores: 3,
        comment: "um comentario",
      },
      {
        user_id: 1,
        tour_id: 2,
        scores: 3,
        comment: "um comentario",
      },
      {
        user_id: 1,
        tour_id: 1,
        scores: 3,
        comment: "um comentario",
      },
      {
        user_id: 2,
        tour_id: 2,
        scores: 3,
        comment: "um comentario",
      },
    ]);
  },

  down: async (QueryInterface, Sequelize) => {
    await Review.destroy({
      where: {
        [Op.or]: [
          { user_id: 2, tour_id: 2 },
          { user_id: 1, tour_id: 2 },
          { user_id: 1, tour_id: 1 },
        ],
      },
    });
  },
};
