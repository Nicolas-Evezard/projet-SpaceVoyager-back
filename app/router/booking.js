const express = require("express");
const router = express.Router();

const { bookingController } = require("../controller");

/**
 * GET /booking
 * @summary Get all planets and hostels depending on disponibility
 * @tags Booking
 * @param {Booking} request.query.required - Booking info (hotel and room depending on query)
 * @return {[Booking]} 200 - success response - application/json
 * @return {ApiError} 400 - Bad request response - application/json
 * @return {ApiError} 404 - Research not found
 * @return {ApiError} 500 - Internal server error
 */
router.get("/search", bookingController.search);

/**
 * DELETE /booking/:id
 * @summary Delete a booking
 * @tags Booking
 * @param {number} id.path.required - booking identifier
 * @return {Booking} 200 - success response - application/json
 * @return {ApiError} 400 - Bad request response - application/json
 * @return {ApiError} 404 - Booking not found
 * @return {ApiError} 500 - Internal server error
 */
router.delete("/:id", bookingController.delete);

/**
 * POST /booking
 * @summary Create a booking
 * @tags Booking
 * @param {Booking} request.body.required - Booking info
 * @return {Booking} 200 - success response - application/json
 * @return {ApiError} 400 - Bad request response - application/json
 * @return {ApiError} 404 - Booking not found
 * @return {ApiError} 500 - Internal server error
 */
router.post("/", bookingController.create);

module.exports = router;
