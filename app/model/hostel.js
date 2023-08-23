const client = require("../service/dbPool");
const debug = require("debug")("model"); // ("model") est le namespace utilisé dans ce fichier
const APIError = require("../service/APIError");

/********************************/
/* Hostel Datamapper            */
/********************************/

const hostelDatamapper = {

    /**
     * Méthode pour récupérer l'ensemble des hostels
     * @returns {Array} tableau d'objets Hostel
     * @returns {null} si aucun hostel n'est trouvé
     * @returns {Error} si une erreur est survenue
     * @async
     */
  async getAll() {
    // je prépare ma requête SQL
    const sqlQuery = `
            SELECT * FROM web.get_all_hostel();
        `;

    let result;
    let error;

    try {
      // j'envoie ma requête à ma BDD
      const response = await client.query(sqlQuery);
      // je place la réponse dans result
      result = response.rows;
      debug(result);
    } catch (err) {
      // je crèe une erreur 500
      error = new APIError("Erreur interne au serveur", 500, err);
    }

    // je retourne le résultat et l'erreur éventuelle
    return { error, result };
  },

    /**
     * Méthode pour récupérer un hostel
     * @param {int} id - id de l'hostel à récupérer
     * @returns {Object} objet Hostel
     * @returns {null} si aucun hostel n'est trouvé
     * @returns {Error} si une erreur est survenue
     * @async
     */
  async getOne(id) {
    // je prépare ma requête SQL
    const sqlQuery = `
            SELECT * FROM web.get_hostel($1);
        `;
    // je place les valeurs dans un tableau pour utiliser le système de parameterized query (requête paramétrée)
    const values = [id];

    let result;
    let error;

    try {
      const response = await client.query(sqlQuery, values);

      // je teste pour savoir si au moins une ligne a été retournée
      if (response.rows.length == 0) {
        // aucune catégorie n'a été trouvée
        error = new APIError("Aucune catégorie n'a été trouvée", 404);
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

module.exports = hostelDatamapper;
