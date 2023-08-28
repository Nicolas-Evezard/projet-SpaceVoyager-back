const client = require("../service/dbPool");
const debug = require("debug")("model");
const APIError = require("../service/APIError");

const hostelDatamapper = {
  
  /**
   * Method to get all hostels
   * @returns {Array} Array of Hostel objects
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
      error = new APIError("No hotel found", 404);
    }
    return { error, result };
  },

  /**
   * Method to get one hostel
   * @param {int} -id of the hostel
   * @returns {Object} Hostel object
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
      error = new APIError("No hotel found", 404);
    }
    return { error, result };
  },
};

module.exports = hostelDatamapper;
