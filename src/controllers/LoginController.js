const { sign } = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { loginSchema } = require("../middleware/validationSchemas");

class LoginController {
  async login(req, res) {
    try {
      await loginSchema.validate(req.body, {
        abortEarly: false,
        strict: true,
      });

      const { email, password } = req.body;

      const user = await User.findOne({
        where: { email },
      });
      if (!user) {
        return res.status(404).json({
          error: "Nenhum usuario corresponde a email e senhas fornecidos!",
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(404).json({
          error: "Senha incorreta!",
        });
      }

      const payload = { sub: user.id, email: user.email, nome: user.name };

      const token = sign(payload, process.env.SECRET_JWT);

      res.status(200).json({ Token: token });
    } catch (error) {
      handleCatchError(error, res, "login");
    }
  }
}

module.exports = new LoginController();
