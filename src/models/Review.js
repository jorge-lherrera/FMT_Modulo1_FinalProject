const { DataTypes } = require("sequelize");
const { connection } = require("../database/connection");

const Review = connection.define("reviews", {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "users",
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },
  tour_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "tours",
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },
  scores: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
  comment: {
    type: DataTypes.STRING(255),
  },
});

module.exports = Review;
