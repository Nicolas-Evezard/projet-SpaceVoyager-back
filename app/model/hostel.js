const client = require("../service/dbPool");
const debug = require("debug")("model");
const APIError = require("../service/APIError");

/**
 * @typedef {object} Hostel
 * @property {number} id - Identifiant unique Pk de la table
 * @property {string} name - Name of the hostel
 * @property {string} content - Description of the hostel
 * @property {string} adress - Adress of the hostel
 * @property {string} img - image name for the hostel
 * @property {number} planet_id - the id of linked planet
 */

const hostelDatamapper = {
  /**
   * Method to get all hostels
   * @returns {[Hostel]} Array of Hostel objects
   * @returns {404} if no hostel found
   * @returns {500} if an error occured
   * @async
   */
  async getAll() {
    const sqlQuery = `SELECT * FROM web.get_all_hostel();`;
    let result;
    let error;
    try {
      const response = await client.query(sqlQuery);
      result = response.rows;
    } catch (err) {
      error = new APIError("Internal server error", 500, err);
    }
    if (result.length == 0) {
      error = new APIError("Hostel not found", 404);
    }
    return { error, result };
  },

  /**
   * Method to get one hostel
   * @param {int} id - id of the hostel
   * @returns {Hostel} Hostel object
   * @returns {404} if no hostel found
   * @returns {500} if an error occured
   * @async
   */
  async getOne(id) {
    const sqlQuery = `SELECT * FROM web.get_hostel($1);`;
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
      error = new APIError("Hostel not found", 404);
    }
    return { error, result };
  },
};

module.exports = hostelDatamapper;
