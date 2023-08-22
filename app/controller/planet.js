const { planetDatamapper } = require("../model");
const debug = require("debug")("controller");

const planetController = {
  /**
   * Récupère et retourne l'ensemble des catégories
   * @param {*} res
   * @param {*} next
   */
  async getAll(_, res, next) {
    const { error, result } = await planetDatamapper.getAll();
    if (error) {
      // si j'ai une erreur => next(error)
      next(error);
    } else {
      // si tout va bien
      res.json(result);
    }
  },

  /**
   * Récupère et retourne l'ensemble des catégories
   * @param {*} res
   * @param {*} next
   */
  async getOne(_, res, next) {
    const { error, result } = await planetDatamapper.getOne();
    if (error) {
      // si j'ai une erreur => next(error)
      next(error);
    } else {
      // si tout va bien
      res.json(result);
    }
  },
};

module.exports = planetController;
