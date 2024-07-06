const bcrypt = require("bcrypt");
const User = require("../models/User");
const Tour = require("../models/Tour");
const { userSchema } = require("../middleware/validationSchemas");
const handleCatchError = require("../middleware/handleCatchErrors");

class UserController {
  async findAll(req, res) {
    /*  
      #swagger.tags = ['Usuarios']
      #swagger.description = 'Endpoint para obtener todos los usuarios'
      #swagger.responses[200] = {
        description: 'Lista de usuarios obtenida con éxito',
        schema: [{
          id: "ID de usuario",
          name: "Nombre del usuario",
          email: "usuario@example.com",
          password: "hashed_password",
          birth_date: "YYYY-MM-DD",
          user_type: "guia" // o "turista"
        }]
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
    */
    try {
      const users = await User.findAll();
      if (res) {
        return res.json(users);
      }
      return users;
    } catch (error) {
      handleCatchError(error, res, "findAll_users");
    }
  }

  async create(req, res) {
    /*  
      #swagger.tags = ['Usuarios']
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Crear Usuario',
        required: true,
        schema: {
          $name: "Nombre del usuario",
          $email: "example@example.com",
          $password: "password123",
          $birth_date: "YYYY-MM-DD",
          $user_type: "Tipo de usuario (guia) o (turista)"
        }
      }
      #swagger.responses[201] = {
        description: 'Usuario creado con éxito',
        schema: {
          message: "Usuario creado con éxito",
          user: {
            id: 1,
            name: "Nombre del usuario",
            email: "usuario@example.com",
            birth_date: "YYYY-MM-DD",
            user_type: "guia" // o "turista"
          }
        }
      }
      #swagger.responses[400] = {
        description: 'Error de validación o email existente'
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
    */
    try {
      await userSchema.validate(req.body, {
        abortEarly: false,
        strict: true,
      });

      const { name, email, password, birth_date, user_type } = req.body;

      if (!birth_date.match(/\d{4}-\d{2}-\d{2}/gm)) {
        return res.status(400).json({
          message: "Formato correcto de la fecha de nacimiento: AAAA-MM-DD",
        });
      }

      const existingUser = await User.findOne({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({
          message: "El email ya está registrado. Por favor, elija otro.",
        });
      }

      const hash = await bcrypt.hash(password, 8);

      const user = await User.create({
        name,
        email,
        password: hash,
        birth_date,
        user_type,
      });

      res.status(201).json({ message: "Usuario creado con éxito", user });
    } catch (error) {
      handleCatchError(error, res, "create_user");
    }
  }

  async delete(req, res) {
    /*  
      #swagger.tags = ['Usuarios']
      #swagger.description = 'Eliminar un usuario por ID'
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID del usuario a eliminar',
        required: true,
        type: 'integer'
      }
      #swagger.responses[200] = {
        description: 'Usuario eliminado con éxito',
        schema: {
          message: "Usuario eliminado con éxito"
        }
      }
      #swagger.responses[403] = {
        description: 'Usuario no puede ser eliminado por falta de permisos o tiene tours asociados'
      }
      #swagger.responses[404] = {
        description: 'Usuario no encontrado'
      }
      #swagger.responses[500] = {
        description: 'Error interno del servidor'
      }
    */
    try {
      const { id } = req.params;
      const authenticatedUserId = req.payload.sub;

      const user = await User.findByPk(id);
      const tours = await Tour.findAll({
        where: { user_id: id },
      });

      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      if (tours.length > 0) {
        return res.status(403).json({
          message: "Usuario no puede ser eliminado, tiene tours asociados",
        });
      }

      if (user.id !== authenticatedUserId) {
        return res.status(403).json({
          message: "No tienes permiso para eliminar este usuario.",
        });
      }

      await User.destroy({
        where: { id },
      });

      res.status(200).json({ message: "Usuario eliminado con éxito" });
    } catch (error) {
      handleCatchError(error, res, "delete_user");
    }
  }
}

module.exports = new UserController();
