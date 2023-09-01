const client = require("../service/dbPool");
const debug = require("debug")("model");
const APIError = require("../service/APIError");

const userDatamapper = {
  /**
   * Method to create a user
   * @param {object} user - informations of a user
   * @returns {500} - if an error occured
   * @async
   */
  async addOne(user) {
    const sqlQuery = `SELECT * FROM web.insert_user($1)`;
    const values = [user];
    let result;
    let error;
    try {
      const response = await client.query(sqlQuery, values);
      result = response.rows;
    } catch (err) {
      error = new APIError("Internal server error", 500);
    }
    return { error, result };
  },

  /**
   * Method to delete a user
   * @param {int} id - id of a user
   * @returns {boolean} - true if a user has been deleted
   * @returns {404} - if a user do not exist
   * @returns {500} - if an error occured
   * @async
   */
  async deleteOne(id) {
    const sqlQuery = `SELECT * FROM web.delete_user($1);`;
    const values = [id];
    let result;
    let error;
    try {
      const response = await client.query(sqlQuery, values);
      if (response.rows == false) {
        error = new APIError("User not found", 404);
      } else {
        result = true;
      }
    } catch (err) {
      error = new APIError("Internal server error", 500, err);
    }
    return { error, result };
  },

  /**
   * Method to get a user by his id
   * @param {int} id - id of a user
   * @returns {Object} - User object
   * @returns {404} - if a user do not exist
   * @returns {500} - if an error occured
   * @async
   */
  async getOne(userId) {
    const sqlQuery = `SELECT * FROM web.get_one_user($1)`;
    const values = [userId];
    let result;
    let error;
    try {
      const response = await client.query(sqlQuery, values);
      result = response.rows;
    } catch (err) {
      error = new APIError("Internal error server", 500);
    }
    if (result.length === 0 || result[0].id === null) {
      error = new APIError("User not found", 404);
    }
    return { error, result };
  },

  /**
   * Method to modify a user
   * @param {object} userInfo - informations of a user
   * @returns {Object} - User object with updated informations
   * @returns {500} - if an error occured
   * @async
   */
  async modifyOne(userInfo) {
    const sqlQuery = `SELECT * FROM web.update_user($1)`;
    const values = [userInfo];
    let result;
    let error;
    try {
      const response = await client.query(sqlQuery, values);
      result = response.rows;
    } catch (err) {
      debug(err);
      error = new APIError("Internal error server", 500);
    }
    return { error, result };
  },

  /**
   * Method to log a user
   * @param {object} user - user mail
   * @returns {Object} - user mail
   * @returns {400} - if incorrect email or password
   * @returns {500} - if an error occured
   * @async
   */
  async checkUser(user) {
    const sqlQuery = `SELECT * FROM web.check_user($1);`;
    const values = [user];
    let result;
    let error;
    try {
      const response = await client.query(sqlQuery, values);
      if (response.rows[0].mail == null) {
        error = new APIError("Incorrect email or password", 400);
      } else {
        result = response.rows[0];
      }
    } catch (err) {
      error = new APIError("Internal server error", 500, err);
    }
    return { error, result };
  },
};

module.exports = userDatamapper;
