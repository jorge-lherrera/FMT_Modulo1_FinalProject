const { DataTypes } = require("sequelize");
const { connection } = require("../database/connection");

const Booking = connection.define("bookings", {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tour_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Booking;
