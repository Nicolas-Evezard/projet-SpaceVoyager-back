const { hostelDatamapper } = require("../model");
const debug = require("debug")("controller");

const hostelController = {
  /**
   * Méthode pour récupérer l'ensemble des hotels
   * @param {*} _ 
   * @param {*} res 
   * @param {*} next 
   */
  async getAll(_, res, next) {
    // j'appelle mon datamapper pour récupérer les données en BDD
    const { error, result } = await hostelDatamapper.getAll();

    if (error) {
      // si j'ai une erreur => next(error)
      next(error);
    } else {
       // si tout s'est bien passé
      res.json(result);
    }
  },

  /**
   * Méthode pour récupérer un hotel
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async getOne(req, res, next) {
    // je récupère l'id dans l'url
    const { id } = req.params;

    // j'appelle mon datamapper pour récupérer les données en BDD
    const { error, result } = await hostelDatamapper.getOne(id);

    if (error) {
      // si j'ai une erreur => next(error)
      next(error);
    } else {
      // si tout s'est bien passé
      res.json(result);
    }
  },
};

module.exports = hostelController;
