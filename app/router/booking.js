// REQUIRE MODULES
const express = require("express");
const router = express.Router();
const validationService = require("../service/validation/validationService");

// CONTROLLER
const { bookingController } = require("../controller");

//ROUTES
/**
 * GET /search
 * @summary Get a booking
 * @description Get all planets and hostels depending on disponibility
 * @tags Booking
 * @param {object} request.query.required - Example : search?departureDate=2023-09-06&comebackDate=2023-09-07&person=2
 * @return {Array<Planet|Hostel>} 200 - success response - application/json
 * @return {ApiError} 400 - Bad request response - application/json
 * @return {ApiError} 404 - Research not found
 * @return {ApiError} 500 - Internal server error
 */

router.get("/search", bookingController.search);

/**
 * DELETE /booking/:id
 * @summary Delete a booking
 * @description Delete a booking depending on the id in req.params and the logged user
 * @tags Booking
 * @param {number} id.path.required - booking identifier
 * @return {Booking} 200 - success response - application/json
 * @return {ApiError} 400 - Bad request response - application/json
 * @return {ApiError} 404 - Booking not found
 * @return {ApiError} 500 - Internal server error
 */
router.delete(
  "/:id(\\d+)",
  validationService.isConnected,
  bookingController.delete
);

/**
 * POST /booking
 * @summary Create a booking
 * @description Create a booking depending on request.body
 * @tags Booking
 * @param {Booking} request.body.required - Booking info
 * @return {Booking} 200 - success response - application/json
 * @return {ApiError} 400 - Bad request response - application/json
 * @return {ApiError} 404 - Booking not found
 * @return {ApiError} 500 - Internal server error
 */
router.post(
  "/",
  validationService.isConnected,
  validationService.isBooking("insert"),
  bookingController.create
);

module.exports = router;
