const client = require("../service/dbPool");
const debug = require("debug")("model");
const APIError = require("../service/APIError");

const planetDatamapper = {

    /**
   * Method to get all planets
   * @returns {Array} Array of Planets objects
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
   * @param {int} -id of the planet
   * @returns {Object} Planet object
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
