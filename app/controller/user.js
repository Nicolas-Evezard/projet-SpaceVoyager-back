const { userDatamapper } = require("../model");
const bcrypt = require("bcrypt");
const debug = require("debug")("controller");
const jwt = require("jsonwebtoken");
const APIError = require("../service/APIError");
const saltRounds = 10;

const userController = {
  
  /**
   * Méthode pour register un user
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async register(req, res, next) {
    try {
      // Je sépare le password de userData des infos reçu depuis le client
      const {
        password,
        ...userData
      } = req.body;
      // Générer un salt pour le cryptage, là je décide de couper le password en 10
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // J'utilise le spread operator pour créer un nouvel objet password qui prend en compte les propriété de l'objet userData
        const {
        error,
        result
      } = await userDatamapper.addOne({
        ...userData,
        password: hashedPassword,
      });

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

  /**
   * Méthode pour récupérer un user par son id
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async getOne(req, res, next) {
    const {
      error,
      result
    } = await userDatamapper.getOne(req.params.id);

    if (error) {
      next(error);
    } else {
      res.json(result);
    }
  },

  /**
   * Récupère et modify un user
   *@param {*} req
   * @param {*} res
   * @param {*} next
   */
  async modifyOne(req, res, next) {
    const user = req.body;
    user.id = req.params.id;
    const {
      error,
      result
    } = await userDatamapper.modifyOne(user);

    if (error) {
      // si j'ai une erreur => next(error)
      next(error);
    } else {
      // si tout va bien
      res.json(result);
    }
  },

  /**
   * Récupère et supprime un user
   *@param {*} req
   * @param {*} res
   * @param {*} next
   */
  async deleteOne(req, res, next) {
    const {
      error,
      result
    } = await userDatamapper.deleteOne();
    if (error) {
      // si j'ai une erreur => next(error)
      next(error);
    } else {
      // si tout va bien
      res.json(result);
    }
  },

  /**
   * Méthode pour login un user
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async login(req, res, next) {
    const {
      error,
      result
    } = await userDatamapper.checkUser(req.body);

    if (error) {
      // si j'ai une erreur => next(error)
      next(error);
    } else {
      // si tout va bien
      if (result) {
        debug(result)
        debug(req.body)
        const match = await bcrypt.compare(req.body.password, result.password);
        if (match) {
          // j'enregistre les informations de l'utilisateur dans la session
          req.session.user = result;
          delete req.session.user.password;
          debug(req.session.user);

          // je génère un token à partir des informations de mon utilisateur et du secret
          const token = jwt.sign({
            user: req.session.user
          }, process.env.JWT_SECRET);

          // je retourne le token
          res.json({
            logged: true,
            id: req.session.user.id,
            firstname: req.session.user.firstname,
            token: token
          });
        } else {
          // le couple email/mot de passe est incorrect
          const err = new APIError("Mot de passe ou mail incorrect", 400);
          next(err);
        }
      } else {
        // le couple email/mot de passe est incorrect
        const err = new APIError("Mot de passe ou mail incorrect", 400);
        next(err);
      }
    }
  },
};

module.exports = userController;