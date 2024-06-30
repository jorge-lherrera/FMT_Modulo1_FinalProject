const yup = require("yup");
const User = require("../models/User");
const Tour = require("../models/Tour");

const userSchema = yup.object().shape({
  name: yup.string().required("O nome e obrigatorio"),
  email: yup.string().email().required("O email e obrigatorio"),
  password: yup.string().required("A senha é obrigatoria"),
  // birth_date: yup.date().required("A data de nascimento e obrigatoria"),
  // user_type:
});

class UserController {
  async findAll(req, res) {
    const users = await User.findAll();
    if (res) {
      res.json(users);
    } else {
      return users;
    }
  }
  async create(req, res) {
    try {
      await userSchema.validate(req.body, {
        abortEarly: false,
        strict: true,
      });

      const { name, email, password, birth_date, user_type } = req.body;
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
      console.log(error.message);
      res.status(500).json(error.message);
    }
  }
  async delete(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      const tour = await Tour.findAll({
        where: { user_id: id },
      });
      if (!user) {
        return res.status(404).json({ message: "Usuario não encontrado" });
      }
      if (tour.length > 0) {
        return res.status(403).json({
          message: "Usuário não se pode eliminar, tem locales asociados!",
        });
      } else {
        await User.destroy({
          where: {
            id,
          },
        });
      }

      res.status(200).json({ message: "Usuario eliminado com sucesso" });
    } catch (error) {
      console.log(error.message);
      res
        .status(500)
        .json({ error: "Error ao eliminar o usuario", error: error });
    }
  }
}

module.exports = new UserController();
