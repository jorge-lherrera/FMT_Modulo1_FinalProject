const { DataTypes } = require("sequelize");
const { connection } = require("../database/connection");
const Tour = require("./Tour");
const Booking = require("./Booking");
const Review = require("./Review");

const User = connection.define("users", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  birth_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  user_type: {
    type: DataTypes.ENUM("guia", "turista"),
    allowNull: false,
  },
  sex: {
    type: DataTypes.ENUM("M", "F"),
    allowNull: false,
  },
  cpf: {
    type: DataTypes.BIGINT,
    allowNull: false,
    unique: true,
    validate: {
      len: { args: [11, 11] },
    },
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
});

User.hasMany(Tour, { foreignKey: "user_id", sourceKey: "id" });
Tour.belongsTo(User, { foreignKey: "user_id", targetId: "id" });

User.hasMany(Booking, { foreignKey: "user_id", sourceKey: "id" });
Booking.belongsTo(User, { foreignKey: "user_id", targetId: "id" });

User.hasMany(Review, { foreignKey: "user_id", sourceKey: "id" });
Review.belongsTo(User, { foreignKey: "user_id", targetId: "id" });

module.exports = User;
