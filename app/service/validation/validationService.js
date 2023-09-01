const APIError = require("../APIError");
const jwt = require("jsonwebtoken");
const debug = require("debug")("validationService");

const validationService = {
  isConnected(req, res, next) {
    //!if (req.session.user) {
    console.log("this is validation service");
    let error;
    let decoded;
    const requestHeaders = req.headers;
    // par exemple : 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmb28iOiJiYXIiLCJpYXQiOjE2OTA1MzY2NTJ9.VrLLfbpP9al583wAfRmXMe9LLJnGo5bzvIv7qRLMZ7Q'
    const authorizationHeader = requestHeaders.authorization;

    // le split(" ") découpe ma chaine de caractères suivant un séprateur " " (ici c'est l'espace)
    const authorizationInformation = authorizationHeader.split(" "); // je me retrouve avec un tableau de string

    if (authorizationInformation.length == 2) {
      const token = authorizationInformation[1];

      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
        error = new APIError("Token invalide 1", 500, err);
        next(error);
      }
      // le token et la session sont ils identiques ?
      if (JSON.stringify(decoded.user)) {
        req.user = decoded.user; // user contient quelque chose, sous-entendu je suis connecté, je peux passer à la suite
        next();
      } else {
        console.log("Token invalide");
        error = new APIError("Token invalide 2", 500);
        next(error);
      }
    } else {
      console.log("Token invalide");
      error = new APIError("Token invalide 3", 500);
      next(error);
    }
    //!} else {
    //!  console.log("Token invalide");
    //   const error = new APIError("Token invalide", 500);
    //   next(error);
    //!}
  },
};

module.exports = validationService;
