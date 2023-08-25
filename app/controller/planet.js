const { planetDatamapper } = require("../model");
const debug = require("debug")("controller");

const planetController = {

  /**
   * Method to get all planets
   * @param {*} res
   * @param {*} next
   */
  async getAll(_, res, next) {
    const { error, result } = await planetDatamapper.getAll();
    if (error) {
      next(error);
    } else {
      res.json(result);
    }
  },

  /**
   * Method to get one planet
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async getOne(req, res, next) {
    const { id } = req.params;
    const { error, result } = await planetDatamapper.getOne(id);
    if (error) {
      next(error);
    } else {
      res.json(result);
    }
  },
};

module.exports = planetController;
