const { userDatamapper } = require("../model");
const debug = require("debug")("controller");

const userController = {
  async register(req, res, next) {},
  async getOne(req, res, next) {},
  async modify(req, res, next) {},

  
    /**
  * Récupère et supprime un user
  *@param {*} req
  * @param {*} res
  * @param {*} next
  */
  async delete(req, res, next) {
    const { error, result } = await userDatamapper.delete();
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
