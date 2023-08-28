const client = require("../service/dbPool");
const debug = require("debug")("model"); // ("model") est le namespace utilisé dans ce fichier
const APIError = require("../service/APIError");

const bookingDatamapper = {
  async searchHostel(person, departure, comeback, planet) {
    // je prépare ma requête SQL
    const sqlQuery = ` SELECT * FROM web.search_available_hostel($1,$2,$3,$4)`;
    // je place les valeurs dans un tableau pour utiliser le système de parameterized query (requête paramétrée)
    const values = [person, departure, comeback, planet];

    let result;
    let error;

    try {
      const response = await client.query(sqlQuery, values);

      // je teste pour savoir si au moins une ligne a été retournée
      if (response.rows.length == 0) {
        // aucune planet n'est disponible
        error = new APIError("Aucun hôtel n'est disponible", 404);
      } else {
        // je place la réponse dans result
        result = response.rows;
      }
    } catch (err) {
      debug(err);
      // je crée une erreur 500
      error = new APIError("Erreur interne au serveur", 500, err);
    }

    // je retourne le résultat et l'erreur éventuelle
    return { error, result };
  },
  async searchPlanet(person, departure, comeback) {
    debug(departure);
    debug(comeback);
    debug(person);
    // je prépare ma requête SQL
    const sqlQuery = `SELECT * FROM web.search_available_planet($1,$2,$3)`;
    // je place les valeurs dans un tableau pour utiliser le système de parameterized query (requête paramétrée)
    const values = [person, departure, comeback];

    let result;
    let error;

    try {
      const response = await client.query(sqlQuery, values);

      //TODO je teste pour savoir si au moins une ligne a été retournée
      if (response.rows.length == 0) {
        // aucune chambre n'est disponible
        error = new APIError(
          "La dernière chambre d'hôtel a été prise entre temps",
          404
        );
      } else {
        // je place la réponse dans result
        result = response.rows;
      }
    } catch (err) {
      debug(err);
      // je crée une erreur 500
      error = new APIError("Erreur interne au serveur", 500, err);
    }

    // je retourne le résultat et l'erreur éventuelle
    return { error, result };
  },

  async delete(id, user) {
    // je prépare ma requête SQL
    const sqlQuery = `SELECT * FROM web.delete_booking($1, $2)`;
    // je place les valeurs dans un tableau pour utiliser le système de parameterized query (requête paramétrée)
    const values = [id, user];

    let result;
    let error;

    try {
      const response = await client.query(sqlQuery, values);
      debug(response);

      // je teste pour savoir si au moins une ligne a été retournée
      if (response.rows[0].delete_booking == false) {
        // aucune réservation n'a été supprimée
        error = new APIError("Aucune réservation n'a été supprimée", 404);
      } else {
        // je place la réponse dans result
        result = response.rows[0].delete_booking;
      }
    } catch (err) {
      // je crée une erreur 500
      error = new APIError("Erreur interne au serveur", 500, err);
    }

    // je retourne le résultat et l'erreur éventuelle
    return { error, result };
  },

  async create(obj) {
    // je prépare ma requête SQL
    const sqlQuery = `SELECT * FROM web.insert_booking($1)`;
    // je place les valeurs dans un tableau pour utiliser le système de parameterized query (requête paramétrée)
    const values = [obj];

    let result;
    let error;

    try {
      const response = await client.query(sqlQuery, values);
      debug(response);

      // je teste pour savoir si au moins une ligne a été retournée
      if (response.rows.length == 0) {
        // aucune réservation n'a été créée
        error = new APIError("Aucune réservation n'a été créée", 404);
      } else {
        // je place la réponse dans result
        result = response.rows[0];
        debug(result);
      }
    } catch (err) {
      // je crée une erreur 500
      debug(err);
      error = new APIError("Erreur interne au serveur", 500, err);
    }

    // je retourne le résultat et l'erreur éventuelle
    return { error, result };
  },
};

module.exports = bookingDatamapper;
