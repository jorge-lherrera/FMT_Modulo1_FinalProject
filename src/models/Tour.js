const { DataTypes } = require("sequelize");
const { connection } = require("../database/connection");
const Booking = require("./Booking");
const Review = require("./Review");

const Tour = connection.define("tours", {
  tour_title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  local: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  max_number_users: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  usersWhoTookTour_id: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    defaultValue: [],
  },
  cep: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      len: { args: [8, 8] },
    },
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  lat: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  lng: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Tour.hasMany(Booking, { foreignKey: "tour_id", sourceKey: "id" });
Booking.belongsTo(Tour, { foreignKey: "tour_id", targetId: "id" });

Tour.hasMany(Review, { foreignKey: "tour_id", sourceKey: "id" });
Review.belongsTo(Tour, { foreignKey: "tour_id", targetId: "id" });

module.exports = Tour;
