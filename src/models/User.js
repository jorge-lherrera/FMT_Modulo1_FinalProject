const { DataTypes } = require("sequelize");
const { connection } = require("../database/connection");

const User = connection.define("users", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
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
});

module.exports = User;
