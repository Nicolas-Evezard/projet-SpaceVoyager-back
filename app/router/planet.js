const express = require("express");
const router = express.Router();

const { planetController } = require("../controller");

/**
 * GET /planet
 * @summary Get all planet
 * @tags Planet
 * @return {[Planet]} 200 - success response - application/json
 * @return {ApiError} 400 - Bad request response - application/json
 * @return {ApiError} 404 - Planets not found
 * @return {ApiError} 500 - Internal server error
 */
router.get("/", planetController.getAll);

/**
 * GET /planet/{id}
 * @summary Get one planet
 * @tags Planet
 * @param {number} id.path.required - planet identifier
 * @return {Planet} 200 - success response - application/json
 * @return {ApiError} 400 - Bad request response - application/json
 * @return {ApiError} 404 - Planet not found
 * @return {ApiError} 500 - Internal server error
 */
router.get("/:id", planetController.getOne);

module.exports = router;
