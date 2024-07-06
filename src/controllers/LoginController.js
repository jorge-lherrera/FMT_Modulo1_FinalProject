const { sign } = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { loginSchema } = require("../middleware/validationSchemas");
const handleCatchError = require("../middleware/handleCatchErrors");

class LoginController {
  async login(req, res) {
    /*  
      #swagger.tags = ['Login']
      #swagger.description = 'Endpoint para realizar login'
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Credenciales de usuario para iniciar sesión',
        required: true,
        schema: {
          $email: "example@example.com",
          $password: "password123"
        }
      }
      #swagger.responses[200] = {
        description: 'Login exitoso',
        schema: {
          Token: "JWT token"
        }
      }
      #swagger.responses[404] = {
        description: 'Usuario no encontrado o contraseña incorrecta'
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
    */
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
          error: "Nenhum usuário corresponde ao email fornecido!",
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
