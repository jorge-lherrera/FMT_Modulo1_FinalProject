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
});

User.hasMany(Tour, { foreignKey: "user_id", sourceKey: "id" });
Tour.belongsTo(User, { foreignKey: "user_id", targetId: "id" });

User.hasMany(Booking, { foreignKey: "user_id", sourceKey: "id" });
Booking.belongsTo(User, { foreignKey: "user_id", targetId: "id" });

User.hasMany(Review, { foreignKey: "user_id", sourceKey: "id" });
Review.belongsTo(User, { foreignKey: "user_id", targetId: "id" });

module.exports = User;
