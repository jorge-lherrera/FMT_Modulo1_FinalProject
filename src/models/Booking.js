const { DataTypes } = require("sequelize");
const { connection } = require("../database/connection");

const Booking = connection.define("bookings", {
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
});

module.exports = Booking;
