const { QueryInterface, Sequelize } = require("sequelize");
const Booking = require("../../models/Booking");
const { Op } = Sequelize;

module.exports = {
  up: async (QueryInterface, Sequelize) => {
    await Booking.bulkCreate([
      {
        user_id: 1,
        tour_id: 1,
      },
      {
        user_id: 1,
        tour_id: 1,
      },
      {
        user_id: 1,
        tour_id: 1,
      },
      {
        user_id: 2,
        tour_id: 2,
      },
      {
        user_id: 2,
        tour_id: 2,
      },
    ]);
  },

  down: async (QueryInterface, Sequelize) => {
    await Booking.destroy({
      where: {
        [Op.or]: [
          { user_id: 1, tour_id: 1 },
          { user_id: 2, tour_id: 2 },
        ],
      },
    });
  },
};
