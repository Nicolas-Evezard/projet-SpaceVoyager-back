const express = require("express");
const router = express.Router();

const { hostelController } = require("../controller");

/**
 * GET /hostel
 * @summary Get all hostels
 * @description Retrieves a list of all hostels available.
 * @tags Hostel
 * @return {[Hostel]} 200 - success response - application/json
 * @return {ApiError} 400 - Bad request response - application/json
 * @return {ApiError} 404 - Hostels not found
 * @return {ApiError} 500 - Internal server error
 */
router.get("/", hostelController.getAll);

/**
 * GET /hostel/:id
 * @summary Get one hostel
 * @description Retrieves information about a specific hostel.
 * @tags Hostel
 * @param {int} id.path.required - hostel identifier
 * @return {Hostel} 200 - success response - application/json
 * @return {ApiError} 400 - Bad request response - application/json
 * @return {ApiError} 404 - Hostel not found
 * @return {ApiError} 500 - Internal server error
 */
router.get("/:id(\\d+)", hostelController.getOne);

module.exports = router;
