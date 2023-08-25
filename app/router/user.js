// Déclaration du routeur "user"
// sous-entendu, mon URL est préfixée par /user
const express = require("express");
const router = express.Router();
const validationService = require("../service/validation/validationService");

// Import du controller
const { userController } = require("../controller");

/**
 * POST /user
 * @summary Post one user
 * @tags User
 * @return {[User]} 200 - success response - application/json
 * @return {ApiError} 400 - Bad request response - application/json
 */
router.post("/", userController.register);

/**
 * GET /user
 * @summary Get one user
 * @tags User
 * @param {number} id.path.required - user identifier
 * @return {[User]} 200 - success response - application/json
 * @return {ApiError} 400 - Bad request response - application/json
 */
router.get("/:id", validationService.isConnected, userController.getOne);

/**
 * PATCH /user
 * @summary Patch one user
 * @tags User
 * @param {number} id.path.required - user identifier
 * @return {[User]} 200 - success response - application/json
 * @return {ApiError} 400 - Bad request response - application/json
 */
router.patch("/:id", validationService.isConnected, userController.modifyOne);

//! CHECK IF WE NEED TO PUT VALIDATIONSERVICE INTO ROAD DELETE
/**
 * DELETE /user
 * @summary Delete one user
 * @tags Delete
 * @param {number} id.path.required - user identifier
 * @return {[Delete]} 200 - success response - application/json
 * @return {ApiError} 400 - Bad request response - application/json
 */
router.delete("/:id", validationService.isConnected, userController.deleteOne);

/**
 * POST /login
 * @summary Post user infos
 * @tags Post
 * @return {[Post]} 200 - success response - application/json
 * @return {ApiError} 400 - Bad request response - application/json
 */
router.post("/login", userController.login);

module.exports = router;
