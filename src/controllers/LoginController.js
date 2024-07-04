const { sign } = require("jsonwebtoken");
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
        where: { email, password },
      });
      if (!user) {
        return res.status(404).json({
          error: "Nenhum usuario corresponde a email e senhas fornecidos!",
        });
      }

      const payload = { sub: user.id, email: user.email, nome: user.name };

      const token = sign(payload, process.env.SECRET_JWT);

      res.status(200).json({ Token: token });
    } catch (error) {
      if (error.name === "ValidationError") {
        const errorMessages = error.errors;
        return res.status(400).json({ errors: errorMessages });
      }
      console.log(error.message);
      res.status(500).json({
        error: "Algo deu errado!",
        details: error,
      });
    }
  }
}

module.exports = new LoginController();
