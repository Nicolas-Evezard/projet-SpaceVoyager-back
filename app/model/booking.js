const client = require("../service/dbPool");
const debug = require("debug")("model");
const APIError = require("../service/APIError");

const bookingDatamapper = {

  /**
   * Method to get all Hostels available for a booking
   * @param {int} person - number of person
   * @param {date} departure - departure date
   * @param {date} comeback - comeback date
   * @param {string} planet - planet name
   * @returns {Array} Array of Hostel objects
   * @returns {404} no result
   * @returns {500} if an error occured
   * @async
   */
  async searchHostel(person, departure, comeback, planet) {
    const sqlQuery = ` SELECT * FROM web.search_available_hostel($1,$2,$3,$4)`;
    const values = [person, departure, comeback, planet];
    let result;
    let error;
    try {
      const response = await client.query(sqlQuery, values);
      if (response.rows.length == 0) {
        error = new APIError("No hotel available", 404);
      } else {
        result = response.rows;
      }
    } catch (err) {
      debug(err);
      error = new APIError("Internal server error", 500, err);
    }
    return { error, result };
  },

  /**
   * Method to get all Planets available for a booking
   * @param {int} person - number of person
   * @param {date} departure - departure date
   * @param {date} comeback - comeback date
   * @returns {Array} Array of Planet objects
   * @returns {404} no result
   * @returns {500} if an error occured
   * @async
   */
  async searchPlanet(person, departure, comeback) {
    debug(departure);
    debug(comeback);
    debug(person);
    const sqlQuery = `SELECT * FROM web.search_available_planet($1,$2,$3)`;
    const values = [person, departure, comeback];
    let result;
    let error;
    try {
      const response = await client.query(sqlQuery, values);
      if (response.rows.length == 0) {
        error = new APIError("The last hotel room was taken in the meantime",404);
      } else {
        result = response.rows;
      }
    } catch (err) {
      debug(err);
      error = new APIError("Internal server error", 500, err);
    }
    return { error, result };
  },

  /**
   * Method to delete a booking
   * @param {int} id - id of the booking
   * @returns {boolean} true if the booking has been deleted
   * @returns {404} if no booking found
   * @returns {500} if an error occured
   * @async
   */
  async delete(id, user) {
    const sqlQuery = `SELECT * FROM web.delete_booking($1, $2)`;
    const values = [id, user];
    let result;
    let error;
    try {
      const response = await client.query(sqlQuery, values);
      debug(response);
      if (response.rows[0].delete_booking == false) {
        error = new APIError("No reservations have been cancelled", 404);
      } else {
        result = response.rows[0].delete_booking;
      }
    } catch (err) {
      error = new APIError("Internal server error", 500, err);
    }
    return { error, result };
  },

  /**
   * Method to create a booking
   * @param {Object} obj - object with all the informations needed to create a booking
   * @returns {Object} object with the informations of the booking
   * @returns {404} if no booking found
   * @returns {500} if an error occured
   * @async
   */
  async create(obj) {
    const sqlQuery = `SELECT * FROM web.insert_booking($1)`;
    const values = [obj];
    let result;
    let error;
    try {
      const response = await client.query(sqlQuery, values);
      debug(response);
      if (response.rows.length == 0) {
        error = new APIError("No reservation has been created", 404);
      } else {
        result = response.rows[0];
        debug(result);
      }
    } catch (err) {
      debug(err);
      error = new APIError("Internal server error", 500, err);
    }
    return { error, result };
  },
};

module.exports = bookingDatamapper;
