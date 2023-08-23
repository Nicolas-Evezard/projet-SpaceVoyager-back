const { userDatamapper } = require("../model");
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
        const { error, result } = await userDatamapper.getOne(req.params.id);

        if (error) {
          next(error);
        }
        else {
          res.json(result);
        }
  },

  async modify(req, res, next) {},
  async delete(req, res, next) {},
  async login(req, res, next) {},
};

module.exports = userController;
