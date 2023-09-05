const APIError = require("../APIError");
const jwt = require("jsonwebtoken");
const debug = require("debug")("validationService");

const userSchema = require("../schema/userSchema");
const bookingSchema = require("../schema/bookingSchema");

const validationService = {
  /**
   * Vérification du format des données reçues
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  isUser(schema) {
    return (req, res, next) => {
      const { error } = userSchema[schema].validate(req.body);
      console.log(error);

      if (!error) {
        next();
      } else {
        next(new APIError("Erreur, ce n'est pas un user", 400));
      }
    };
  },

  /**
   * Vérification du format des données reçues
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  isBooking(schema) {
    return (req, res, next) => {
      const { error } = bookingSchema[schema].validate(req.body);
      console.log(error);

      if (!error) {
        next();
      } else {
        next(new APIError("Erreur, ce n'est pas un booking", 400));
      }
    };
  },

  /**
   * Vérification du token d'un user
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */

  isConnected(req, res, next) {
    let error;
    let decoded;
    const requestHeaders = req.headers;
    const authorizationHeader = requestHeaders.authorization;

    const authorizationInformation = authorizationHeader.split(" ");

    if (authorizationInformation.length == 2) {
      const token = authorizationInformation[1];

      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
        error = new APIError("Token invalide 1", 500, err);
        next(error);
      }
      if (JSON.stringify(decoded.user)) {
        req.user = decoded.user;
        next();
      } else {
        error = new APIError("Token invalide 2", 500);
        next(error);
      }
    } else {
      error = new APIError("Token invalide 3", 500);
      next(error);
    }
  },
};

module.exports = validationService;
