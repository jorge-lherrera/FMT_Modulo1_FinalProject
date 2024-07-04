const yup = require("yup");
const User = require("../models/User");
const Tour = require("../models/Tour");

const userSchema = yup
  .object()
  .shape({
    name: yup.string().required("O nome e obrigatorio"),
    email: yup.string().email().required("O email e obrigatorio"),
    password: yup.string().required("A senha é obrigatoria"),
    birth_date: yup.string().required("A data de nascimento e obrigatoria"),
    user_type: yup
      .string()
      .oneOf(
        ["guia", "turista"],
        "O tipo de usuário deve ser 'guia' ou 'turista'"
      )
      .required("O tipo de usuário é obrigatório"),
  })
  .noUnknown(
    true,
    `Os campos adicionais não são permitidos. Campos obrigatorios: name, email, password, birth_date, user_type`
  );

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
      if (error.name === "ValidationError") {
        const errorMessages = error.errors;
        return res.status(400).json({ errors: errorMessages });
      }
      console.log(error.message);
      res.status(500).json({
        error: "Não foi possível cadastrar o usuário",
        details: error,
      });
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
            "Usuário não pode ser eliminado, pois tem locais associados!",
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
      console.log(error.message);
      res
        .status(500)
        .json({ error: "Error ao eliminar o usuario", error: error });
    }
  }
}

module.exports = new UserController();
