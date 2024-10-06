const bcrypt = require("bcrypt");
const User = require("../models/User");
const Tour = require("../models/Tour");
const { userSchema } = require("../middleware/validationSchemas");
const handleCatchError = require("../middleware/handleCatchErrors");

class UserController {
  async findAll(req, res) {
    /*  
      #swagger.tags = ['Usuarios']
      #swagger.description = 'Endpoint para obter todos os usuarios'
      #swagger.responses[200] = {
        description: 'Lista de usuarios obtidas com sucesso',
        schema: [{
          id: "ID do usuario",
          name: "Nome do usuario",
          email: "usuario@exemplo.com",
          password: "exemplo senha",
          birth_date: "YYYY-MM-DD",
          user_type: "guia" ou "turista"
        }]
      }
      #swagger.responses[500] = {
        description: 'Erro interno do servidor'
      }
    */
    try {
      // const users = await User.findAll();
      // if (res) {
      //   return res.json(users);
      // }
      // return users;
      const { count, rows: users } = await User.findAndCountAll();

      return res.json({ totalUsers: count, users });
    } catch (error) {
      handleCatchError(error, res, "findAll_users");
    }
  }

  async create(req, res) {
    /*  
      #swagger.tags = ['Usuarios']
        #swagger.description = 'Endpoint para criar uma usuário'
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Criar Usuário',
        required: true,
        schema: {
          $name: "Nome do usuario",
          $email: "usuario@exemplo.com",
          $password: "exemplo senha",
          $birth_date: "YYYY-MM-DD",
          $user_type: "Tipo de usuario (guia) ou (turista)"
        }
      }
      #swagger.responses[201] = {
        description: 'Usuário criado com sucesso',
        schema: {
          message: "Usuário criado com sucesso",
          user: {
            id: 1,
            name: "Nome do usuario",
            email: "usuario@exemplo.com",
            birth_date: "YYYY-MM-DD",
            user_type: "guia" ou "turista"
          }
        }
      }
      #swagger.responses[400] = {
        description: 'Erro de validação ou email inexistente'
      }
      #swagger.responses[500] = {
        description: 'Erro interno do servidor'
      }
    */
    try {
      await userSchema.validate(req.body, {
        abortEarly: false,
        strict: true,
      });

      const {
        name,
        email,
        password,
        birth_date,
        user_type,
        sex,
        cpf,
        cep,
        address,
        state,
        city,
      } = req.body;

      if (!birth_date.match(/\d{4}-\d{2}-\d{2}/gm)) {
        return res.status(401).json({
          message: "Formato correto da data de nascimento: AAAA-MM-DD",
        });
      }

      const existingUser = await User.findOne({
        where: { email },
      });

      if (existingUser) {
        return res.status(409).json({
          message: "O email inserido já existe. Por favor, escolha outro.",
        });
      }

      const hash = await bcrypt.hash(password, 8);

      const user = await User.create({
        name,
        email,
        password: hash,
        birth_date,
        user_type,
        sex,
        cpf,
        cep,
        address,
        state,
        city,
      });

      res.status(201).json({
        message: "Usuário criado com sucesso",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          user_type: user.user_type,
        },
        user_type: user.user_type,
      });
    } catch (error) {
      handleCatchError(error, res, "create_user");
    }
  }

  async delete(req, res) {
    /*  
      #swagger.tags = ['Usuarios']
      #swagger.description = 'Eliminar um usuario por ID'
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID do usuario a eliminar',
        required: true,
        type: 'integer'
      }
      #swagger.responses[200] = {
        description: 'Usuário eliminado com sucesso',
        schema: {
          message: "Usuário eliminado com sucesso"
        }
      }
      #swagger.responses[403] = {
        description: 'Você não tem permissão para eliminar este usuário.'
      }
      #swagger.responses[404] = {
        description: 'Usuário não encontrado'
      }
      #swagger.responses[500] = {
        description: 'Erro interno do servidor'
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
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      if (tours.length > 0) {
        return res.status(403).json({
          message:
            "Usuário não pode ser eliminado pois tem passeios associados",
        });
      }

      if (user.id !== authenticatedUserId) {
        return res.status(403).json({
          message: "Você não tem permissão para eliminar este usuário.",
        });
      }

      await User.destroy({
        where: { id },
      });

      res.status(200).json({ message: "Usuário eliminado com sucesso" });
    } catch (error) {
      handleCatchError(error, res, "delete_user");
    }
  }

  async updateUserField(req, res) {
    try {
      const { id } = req.params; // Obtiene el id del usuario desde los parámetros de la URL
      const { email } = req.body; // Obtiene el nuevo email desde el cuerpo de la petición (puedes cambiar este campo según lo que quieras actualizar)

      // Verificar si se proporcionó el campo a actualizar
      if (!email) {
        return res.status(400).json({ error: "El campo email es requerido" });
      }

      // Actualizar el campo email del usuario con el id proporcionado
      const [updated] = await User.update({ email }, { where: { id } });

      if (updated) {
        const updatedUser = await User.findByPk(id); // Buscar y retornar el usuario actualizado
        return res.status(200).json({ user: updatedUser });
      } else {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }
}

module.exports = new UserController();
