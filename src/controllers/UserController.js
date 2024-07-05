const User = require("../models/User");
const Tour = require("../models/Tour");
const { userSchema } = require("../middleware/validationSchemas");
const handleCatchError = require("../middleware/handleCatchErrors");

class UserController {
  async findAll(req, res) {
    try {
      const users = await User.findAll();
      if (res) {
        return res.json(users);
      }
      return users;
    } catch (error) {
      console.error(error);
      handleCatchError(error, res, "findAll_users");
    }
  }
  async create(req, res) {
    try {
      await userSchema.validate(req.body, {
        abortEarly: false,
        strict: true,
      });

      const { name, email, password, birth_date, user_type } = req.body;

      if (!birth_date.match(/\d{4}-\d{2}-\d{2}/gm)) {
        return res.status(400).json({
          message: "Formato correto da data de nascimento e ANO-MES-DIA",
        });
      }

      const existingUser = await User.findOne({
        where: { email },
      });

      if (existingUser) {
        return res
          .status(400)
          .json("O email inserido já existe. Por favor, escolha outro.");
      }

      const user = await User.create({
        name,
        email,
        password,
        birth_date,
        user_type,
      });

      res.status(201).json({ message: "Usuario criado com sucesso", user });
    } catch (error) {
      handleCatchError(error, res, "create_user");
    }
  }
  async delete(req, res) {
    try {
      const { id } = req.params;
      const authenticatedUserId = req.payload.sub;

      const user = await User.findByPk(id);
      const tour = await Tour.findAll({
        where: { user_id: id },
      });
      if (!user) {
        return res.status(404).json({ message: "Usuario não encontrado" });
      }

      if (tour.length > 0) {
        return res.status(403).json({
          message:
            "Usuário não pode ser eliminado, pois tem passeios associados!",
        });
      }

      if (user.id !== authenticatedUserId) {
        return res.status(403).json({
          message: "Você não tem permissão para eliminar este usuário.",
        });
      }

      await User.destroy({
        where: {
          id,
        },
      });

      res.status(200).json({ message: "Usuario eliminado com sucesso" });
    } catch (error) {
      handleCatchError(error, res, "delete_user");
    }
  }
}

module.exports = new UserController();
