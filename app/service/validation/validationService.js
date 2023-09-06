// REQUIRE MODULES
const APIError = require("../APIError");
const jwt = require("jsonwebtoken");
const debug = require("debug")("validationService");

// REQUIRE SCHEMAS
const userSchema = require("../schema/userSchema");
const bookingSchema = require("../schema/bookingSchema");

// MIDDLEWARE TO CHECK THE VALIDITY OF DATAs
const validationService = {
  /**
   * Check entering data format for a User
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @param {string} schema - "insert" or "update" to use different schema in the middleware
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
   * Check entering data format for a Booking
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @param {string} schema - "insert" to use the schema in the middleware
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
   * Check the token of a User
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
        error = new APIError("Une erreur est survenue", 500, err);
        next(error);
      }
      if (JSON.stringify(decoded.user)) {
        req.user = decoded.user;
        next();
      } else {
        error = new APIError("Une erreur est survenue", 500);
        next(error);
      }
    } else {
      error = new APIError("Une erreur est survenue", 500);
      next(error);
    }
  },
};

module.exports = validationService;
