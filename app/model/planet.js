const client = require("../service/dbPool");
const debug = require("debug")("model"); // ("model") est le namespace utilisé dans ce fichier
const APIError = require("../service/APIError");

const planetDatamapper = {
  async getAll() {
    const sqlQuery = `SELECT * FROM web.get_all_planets();`;

    let result;
    let error;

    try {
      const response = await client.query(sqlQuery);

      // je teste pour savoir si au moins une ligne a été retournée
      if (response.rows.length == 0) {
        // aucune catégorie n'a été trouvée
        error = new APIError("Aucune planète n'a été trouvée", 404);
      } else {
        // je place la réponse dans result
        result = response.rows;
      }
    } catch (err) {
      // je crèe une erreur 500
      error = new APIError("Erreur interne au serveur", 500, err);
    }

    // je retourne le résultat et l'erreur éventuelle
    return { error, result };
  },

  async getOne(id) {
    const sqlQuery = `SELECT * FROM web.get_planet($1);`;
    const values = [id];

    let result;
    let error;

    try {
      const response = await client.query(sqlQuery, values);

      // je teste pour savoir si au moins une ligne a été retournée
      if (response.rows.length == 0) {
        // aucune planète n'a été trouvée
        error = new APIError("Aucune planète n'a été trouvée", 404);
      } else {
        // je place la réponse dans result
        result = response.rows[0];
      }
    } catch (err) {
      // je crèe une erreur 500
      error = new APIError("Erreur interne au serveur", 500, err);
    }

    // je retourne le résultat et l'erreur éventuelle
    return { error, result };
  },
};

module.exports = planetDatamapper;
