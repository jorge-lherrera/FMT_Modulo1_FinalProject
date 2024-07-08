const { QueryInterface, Sequelize } = require("sequelize");
const Tour = require("../../models/Tour");

module.exports = {
  up: async (QueryInterface, Sequelize) => {
    await Tour.bulkCreate([
      {
        tour_title: "mi primer passeio",
        description: "1 passeio",
        local: "floripa",
        price: 25,
        date: "2024-01-05",
        max_number_users: 5,
        user_id: 1,
      },
      {
        tour_title: "mi passeio",
        description: "8 passeio",
        local: "floripa",
        price: 25,
        date: "2024-01-05",
        max_number_users: 9,
        user_id: 1,
      },
      {
        tour_title: "passeio bom",
        description: "passeio 18",
        local: "ingleses",
        price: 25,
        date: "2024-01-05",
        max_number_users: 8,
        user_id: 1,
      },
      {
        tour_title: "passeio",
        description: "8 passeio",
        local: "floripa",
        price: 25,
        date: "2024-01-05",
        max_number_users: 5,
        user_id: 1,
      },
      {
        tour_title: "mi 5 passeio",
        description: "5 passeio",
        local: "canasvieras",
        price: 25,
        date: "2024-01-05",
        max_number_users: 15,
        user_id: 1,
      },
    ]);
  },

  down: async (QueryInterface, Sequelize) => {
    await Tour.destroy({
      where: {
        user_id: 1,
      },
    });
  },
};
