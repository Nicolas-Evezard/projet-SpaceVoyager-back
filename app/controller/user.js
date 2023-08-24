const { userDatamapper } = require("../model");
const bcrypt = require("bcrypt");
const debug = require("debug")("controller");

const userController = {
  async register(req, res, next) {
    try {
      // Je sépare le password de userData des infos reçu depuis le client
      const { password, ...userData } = req.body;

      // Générer un salt pour le cryptage, là je décide de couper le password en 10
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // J'utilise le spread operator pour créer un nouvel objet password qui prend en compte les propriété de l'objet userData
      const { error, result } = await userDatamapper.addUser({...userData, password: hashedPassword,});

      if (error) {
        // Si j'ai une erreur => next(error)
        next(error);
      } else {
        // Si tout va bien
        res.json(result);
      }
    } catch (error) {
      next(error);
    }
  },

  async getOne(req, res, next) {},
  async modify(req, res, next) {},
  async delete(req, res, next) {},
  async login(req, res, next) {},
};

module.exports = userController;
