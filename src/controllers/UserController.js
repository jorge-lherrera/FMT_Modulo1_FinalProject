const yup = require("yup");
const User = require("../models/User");

const userSchema = yup.object().shape({
  name: yup.string().required("O nome e obrigatorio"),
  email: yup.string().email().required("O email e obrigatorio"),
  password: yup.string().required("A senha é obrigatoria"),
  // birth_date: yup.date().required("A data de nascimento e obrigatoria"),
  // user_type:
});

class UserController {
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
  async delete(req, res) {}
}

module.exports = new UserController();
