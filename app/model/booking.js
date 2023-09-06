// REQUIRE MODULES
const client = require("../service/dbPool");
const debug = require("debug")("model");

//CLASS FOR ERROR
const APIError = require("../service/APIError");

//DEFINE TYPE FOR JSDOC
/** Definition of a Hostel
 * @typedef {object} Hostel
 * @property {number} id - Identifiant unique Pk de la table
 * @property {string} name - Name of the hostel
 * @property {string} content - Description of the hostel
 * @property {string} adress - Adress of the hostel
 * @property {string} img - image name for the hostel
 * @property {number} planet_id - the id of linked planet
 * @property {JSON} room - A Json of the rooms
 */

/** Definition of a Planet
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

/** Definition of a Booking
 * @typedef {object} Booking
 * @property {number} id - Identifiant unique Pk de la table
 * @property {int} total_price - Total price of the booking per person
 * @property {int} hostel_id - Id of the hostel booked
 * @property {int} room_id - Id of the room booked
 * @property {int} departure_id - Id of the departure flight booked
 * @property {int} comeback_id - Id of the comeback flight booked
 * @property {int} user_id - Id of the user who booked the trip
 */

const bookingDatamapper = {
  /**
   * Method to get all Hostels available for a booking
   * @param {int} person - number of person
   * @param {date} departure - departure date
   * @param {date} comeback - comeback date
   * @param {string} planet - planet name
   * @returns {[Hostel]} Array of Hostel objects
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
   * @returns {[Planet]} Array of Planet objects
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
        error = new APIError(
          "The last hotel room was taken in the meantime",
          404
        );
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
   * @returns {[Booking]} - object with the informations of the booking
   * @returns {404} if no insert
   * @returns {409} if booking not available
   * @returns {500} if an error occured
   * @async
   */
  async create(obj) {
    const sqlQuery = `SELECT * from web.available_lastcheck($1, $2, $3, $4, $5)`;
    const values = [
      obj.person,
      obj.dp_date,
      obj.cb_date,
      obj.room_id,
      obj.planet_id,
    ];

    const sqlQueryFinal = `SELECT * FROM web.insert_booking($1)`;
    const valuesFinal = [obj];
    let result;
    let error;
    try {
      const response = await client.query(sqlQuery, values);
      if (response.rows.length == 0) {
        error = new APIError("Order not available", 409);
      } else {
        const responseFinal = await client.query(sqlQueryFinal, valuesFinal);
        if (responseFinal.rows.length == 0) {
          error = new APIError("No reservation has been created", 404);
        } else {
          result = responseFinal.rows[0];
        }
      }
    } catch (err) {
      debug(err);
      error = new APIError("Internal server error", 500, err);
    }
    return { error, result };
  },
};

module.exports = bookingDatamapper;
