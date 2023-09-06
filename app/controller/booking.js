// REQUIRE MODULES
const debug = require("debug")("controller");

// CLASS FOR ERROR
const APIError = require("../service/APIError");

// REQUIRE DATAMAPPER
const { bookingDatamapper } = require("../model");

const bookingController = {
  /**
   * Method to get all booking
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns {void}
   * @async
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
        next(error);
      } else {
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
        next(error);
      } else {
        res.json(result);
      }
    } else {
      const err = new APIError("Url not found !", 404);
      next(err);
    }
  },

  /**
   * Method to delete a booking
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns {void}
   * @async
   */
  async delete(req, res, next) {
    const userId = req.user.id;
    const { error, result } = await bookingDatamapper.delete(
      req.params.id,
      userId
    );
    if (error) {
      next(error);
    } else {
      res.json(result);
    }
  },

  /**
   * Method to create a booking
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns {void}
   * @async
   */
  async create(req, res, next) {
    const { error, result } = await bookingDatamapper.create(req.body);
    if (error) {
      next(error);
    } else {
      res.json(result);
    }
  },
};

module.exports = bookingController;
