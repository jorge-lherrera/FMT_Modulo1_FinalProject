const { DataTypes } = require("sequelize");
const { connection } = require("../database/connection");

const Review = connection.define("reviews", {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tour_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  scores: {
    type: DataTypes.INTEGER,
  },
  comment: {
    type: DataTypes.STRING(255),
  },
});

module.exports = Review;
