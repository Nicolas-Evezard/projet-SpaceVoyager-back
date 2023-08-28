// Déclaration du routeur "booking"
// sous-entendu, mon URL est préfixée par /booking
const express = require("express");
const router = express.Router();
const validationService = require("../service/validation/validationService");

// Import du controller
const { bookingController } = require("../controller");

/**
 * GET /booking
 * @summary Get all planets and hostels depending on disponibility
 * @tags Booking
 * @param {Booking} request.query.required - Booking info (hotel and room depending on query)
 * @return {[Booking]} 200 - success response - application/json
 * @return {ApiError} 400 - Bad request response - application/json
 */
router.get("/search", bookingController.search);

/**
 * DELETE /booking/:id
 * @summary Delete a booking
 * @tags Booking
 * @param {number} id.path.required - booking identifier
 * @return {Booking} 200 - success response - application/json
 * @return {ApiError} 400 - Bad request response - application/json
 */
router.delete("/:id", validationService.isConnected, bookingController.delete);

/**
 * POST /booking
 * @summary Create a booking
 * @tags Booking
 * @param {Booking} request.body.required - Booking info
 * @return {Booking} 200 - success response - application/json
 * @return {ApiError} 400 - Bad request response - application/json
 */
router.post("/", validationService.isConnected, bookingController.create);

module.exports = router;
