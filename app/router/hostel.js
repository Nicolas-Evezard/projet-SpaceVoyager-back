// Déclaration du routeur "hostel"
// sous-entendu, mon URL est préfixée par /hostel
const express = require("express");
const router = express.Router();

// Import du controller
const { hostelController } = require("../controller");

/**
 * GET /hostel
 * @summary Get all hostels
 * @tags Hostel
 * @return {[Hostel]} 200 - success response - application/json
 * @return {ApiError} 400 - Bad request response - application/json
 */
router.get("/", hostelController.getAll);

/**
 * GET /hostel/:id
 * @summary Get one hostel
 * @tags Hostel
 * @param {number} id.path.required - hostel identifier
 * @return {[Hostel]} 200 - success response - application/json
 * @return {ApiError} 400 - Bad request response - application/json
 */
router.get("/:id", hostelController.getOne);

module.exports = router;
