const { QueryInterface, Sequelize } = require("sequelize");
const bcrypt = require("bcrypt");
const User = require("../../models/User");

module.exports = {
  up: async (QueryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash("123senha", 8);
    await User.bulkCreate([
      {
        name: "jorge",
        email: "11@email.com",
        password: hashedPassword,
        birth_date: "1990-01-01",
        user_type: "guia",
      },
      {
        name: "jorge",
        email: "qqqq1111111@test.com",
        password: hashedPassword,
        birth_date: "1990-01-01",
        user_type: "guia",
      },
      {
        name: "pepe456",
        email: "d1111111111@test.com",
        password: hashedPassword,
        birth_date: "1990-01-01",
        user_type: "turista",
      },
      {
        name: "pepe123",
        email: "a8asld@test.com",
        password: hashedPassword,
        birth_date: "1990-01-01",
        user_type: "guia",
      },
      {
        name: "pepe",
        email: "a8asld1111111111@test.com",
        password: hashedPassword,
        birth_date: "1990-01-01",
        user_type: "turista",
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await User.destroy({
      where: {
        email: [
          "11@email.com",
          "qqqq1111111@test.com",
          "d1111111111@test.com",
          "a8asld@test.com",
          "a8asld1111111111@test.com",
        ],
      },
    });
  },
};
