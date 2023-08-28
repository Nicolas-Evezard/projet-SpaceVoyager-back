const { bookingDatamapper } = require("../model");
const debug = require("debug")("controller");
const APIError = require("../service/APIError");

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
      const err = new APIError("Url not found !", 404);
      next(err);
    }
  },

  /**
   * Deleting a booking
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async delete(req, res, next) {
    const userId = req.user.id;
    const { error, result } = await bookingDatamapper.delete(
      req.params.id,
      userId
    );
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
