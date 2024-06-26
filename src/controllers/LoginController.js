const User = require("../models/User");
const { sign } = require("jsonwebtoken");

class LoginController {
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email) {
        return res.status(400).json({ message: "O email e obrigatorio" });
      }

      if (!password) {
        return res.status(400).json({ message: "O password e obrigatorio" });
      }

      const user = await User.findOne({
        where: { email: email, password: password },
      });
      if (!user) {
        return res.status(404).json({
          error: "Nenhum aluno corresponde a email e senhas fornecidos!",
        });
      }

      const payload = { sub: user.id, email: user.email, nome: user.name };

      const token = sign(payload, process.env.SECRET_JWT);

      res.status(200).json({ Token: token });
    } catch (error) {
      return res
        .status(500)
        .json({ error: error, message: "Algo deu errado!" });
    }
  }
}

module.exports = new LoginController();
