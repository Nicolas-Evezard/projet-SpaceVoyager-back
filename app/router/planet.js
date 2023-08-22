// Déclaration du routeur "planet"
// sous-entendu, mon URL est préfixée par /planet
const express = require("express");
const router = express.Router();

// Import du controller
const { planetController } = require("../controller");

/**
 * GET /planet
 * @summary Get all planet
 * @tags Planet
 * @return {[Planet]} 200 - success response - application/json
 * @return {ApiError} 400 - Bad request response - application/json
 */
router.get("/", planetController.getAll);

/**
 * GET /planet/{id}
 * @summary Get one planet
 * @tags Planet
 * @param {number} id.path.required - planet identifier
 * @return {Planet} 200 - success response - application/json
 * @return {ApiError} 400 - Bad request response - application/json
 */
router.get("/:id", planetController.getOne);

module.exports = router;
