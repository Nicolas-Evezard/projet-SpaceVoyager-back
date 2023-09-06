// REQUIRE MODULES
const express = require("express");
const router = express.Router();

//CONTROLLER
const { planetController } = require("../controller");

//ROUTES
/**
 * GET /planet
 * @summary Get all planet
 * @description Retrieves a list of all planets available.
 * @tags Planet
 * @return {[Planet]} 200 - success response - application/json
 * @return {ApiError} 400 - Bad request response - application/json
 * @return {ApiError} 404 - Planets not found
 * @return {ApiError} 500 - Internal server error
 */
router.get("/", planetController.getAll);

/**
 * GET /planet/:id
 * @summary Get one planet
 * @description Retrieves information about a specific planet.
 * @tags Planet
 * @param {number} id.path.required - planet identifier
 * @return {Planet} 200 - success response - application/json
 * @return {ApiError} 400 - Bad request response - application/json
 * @return {ApiError} 404 - Planet not found
 * @return {ApiError} 500 - Internal server error
 */
router.get("/:id(\\d+)", planetController.getOne);

module.exports = router;
