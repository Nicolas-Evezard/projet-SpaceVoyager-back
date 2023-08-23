const { bookingDatamapper } = require("../model");
const debug = require("debug")("controller");
const errorHandler = require("../service/errorHandler");

const bookingController = {
  /**
   * Get all booking
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async search(req, res, next) {
    const person = parseInt(req.query.person);
    if (
      person &&
      req.query.departureDate &&
      req.query.comebackDate &&
      req.query.planet
    ) {
      const { error, result } = await bookingDatamapper.searchHostel(
        person,
        req.query.departureDate,
        req.query.comebackDate,
        req.query.planet
      );
      if (error) {
        // si j'ai une erreur => next(error)
        next(error);
      } else {
        // si tout va bien
        res.json(result);
      }
    } else if (
      req.query.departureDate &&
      req.query.comebackDate &&
      req.query.person
    ) {
      const { error, result } = await bookingDatamapper.searchPlanet(
        person,
        req.query.departureDate,
        req.query.comebackDate
      );
      if (error) {
        // si j'ai une erreur => next(error)
        next(error);
      } else {
        // si tout va bien
        res.json(result);
      }
    } else {
      errorHandler.notFound();
    }
  },

  /**
   * Deleting a booking
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async delete(req, res, next) {
    const { error, result } = await bookingDatamapper.delete(req.params.id);
    if (error) {
      // si j'ai une erreur => next(error)
      next(error);
    } else {
      // si tout va bien
      res.json(result);
    }
  },

  /**
   * Create a booking
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async create(req, res, next) {
    const { error, result } = await bookingDatamapper.create(req.body);
    if (error) {
      // si j'ai une erreur => next(error)
      next(error);
    } else {
      // si tout va bien
      res.json(result);
    }
  },
};

module.exports = bookingController;
