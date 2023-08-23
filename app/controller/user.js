const {
  userDatamapper
} = require("../model");
const debug = require("debug")("controller");

const userController = {

  async register(req, res, next) {},

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
  async modify(req, res, next) {
    const user = req.body;
    user.id = req.params.id;
    const {
      error,
      result
    } = await userDatamapper.modify(user);
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
  async delete(req, res, next) {
    const {
      error,
      result
    } = await userDatamapper.delete();
    if (error) {
      // si j'ai une erreur => next(error)
      next(error);
    } else {
      // si tout va bien
      res.json(result);
    }
  },

  async login(req, res, next) {},
};

module.exports = userController;