const { bookingDatamapper } = require("../model");
const debug = require("debug")("controller");
const errorHandler = require("../service/errorHandler");

const bookingController = {
  async search(req, res, next) {
    if (
      req.query.departureDate &&
      req.query.comebackDate &&
      req.query.person &&
      req.query.planet
    ) {
      const { error, result } = await bookingDatamapper.searchHostel(
        req.query.departureDate,
        req.query.comebackDate,
        req.query.person
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
        req.query.departureDate,
        req.query.comebackDate,
        req.query.person,
        req.query.planet
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
  async delete(req, res, next) {},
  async create(req, res, next) {},
};

module.exports = bookingController;
