const { userDatamapper } = require("../model");
const debug = require("debug")("controller");

const userController = {

  async register(req, res, next) {
    const { error, result } = await userDatamapper.addUser(req.body);

    if (error) {
      // si j'ai une erreur => next(error)
      next(error);
    }
    else {
      // si tout va bien
      res.json(result);
    }

  },

  async getOne(req, res, next) {},
  async modify(req, res, next) {},
  async delete(req, res, next) {},
  async login(req, res, next) {},
};

module.exports = userController;
