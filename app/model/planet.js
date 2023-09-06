// REQUIRE MODULES
const client = require("../service/dbPool");
const debug = require("debug")("model");

//CLASS FOR ERROR
const APIError = require("../service/APIError");

//DEFINE TYPE FOR JSDOC
/**
 * @typedef {object} Planet
 * @property {number} id - Identifiant unique Pk de la table
 * @property {string} name - Name of the planets
 * @property {int} distance - Distance of the planets
 * @property {int} distance_light_year - distance in years of planets
 * @property {string} content - Content of the planets
 * @property {int} radius - Radius of the planets
 * @property {int} temp_min - Minimal temperature of the planets
 * @property {int} temp_max - Maximal temperature of the planets
 * @property {string} img - img url of the planets
 * @property {int} price - Price of the planets
 */

const planetDatamapper = {
  /**
   * Method to get all planets
   * @returns {[Planet]} Array of Planets objects
   * @returns {404} if no planets found
   * @returns {500} if an error occured
   * @async
   */
  async getAll() {
    const sqlQuery = `SELECT * FROM web.get_all_planets();`;
    let result;
    let error;
    try {
      const response = await client.query(sqlQuery);
      if (response.rows.length == 0) {
        error = new APIError("No planet found", 404);
      } else {
        result = response.rows;
      }
    } catch (err) {
      error = new APIError("Internal server error", 500, err);
    }
    return { error, result };
  },

  /**
   * Method to get one planet
   * @param {int} id - id of the planet
   * @returns {Planet} Planet object
   * @returns {404} if no planet found
   * @returns {500} if an error occured
   * @async
   */
  async getOne(id) {
    const sqlQuery = `SELECT * FROM web.get_planet($1);`;
    const values = [id];
    let result;
    let error;
    try {
      const response = await client.query(sqlQuery, values);
      result = response.rows;
    } catch (err) {
      error = new APIError("Internal server error", 500, err);
    }
    if (result.length === 0 || result[0].id === null) {
      error = new APIError("No planet found", 404);
    }
    return { error, result };
  },
};

module.exports = planetDatamapper;
