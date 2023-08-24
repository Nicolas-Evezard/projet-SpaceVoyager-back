// Déclaration du routeur "user"
// sous-entendu, mon URL est préfixée par /user
const express = require("express");
const router = express.Router();

// Import du controller
const { userController } = require("../controller");

/**
 * GET /user
 * @summary Get one user
 * @tags User
 * @param {number} id.path.required - user identifier
 * @return {[User]} 200 - success response - application/json
 * @return {ApiError} 400 - Bad request response - application/json
 */
router.get("/:id", userController.getOne);

/**
 * POST /user
 * @summary Post one user
 * @tags User
 * @return {[User]} 200 - success response - application/json
 * @return {ApiError} 400 - Bad request response - application/json
 */
router.post("/", userController.register);

/**
 * PATCH /user
 * @summary Patch one user
 * @tags User
 * @param {number} id.path.required - user identifier
 * @return {[User]} 200 - success response - application/json
 * @return {ApiError} 400 - Bad request response - application/json
 */
router.patch("/:id", userController.modify);


//! CHECK IF WE NEED TO PUT VALIDATIONSERVICE INTO ROAD DELETE
/**
 * DELETE /user
 * @summary Delete one user
 * @tags Delete
 * @param {number} id.path.required - user identifier
 * @return {[Delete]} 200 - success response - application/json
 * @return {ApiError} 400 - Bad request response - application/json
 */
router.delete("/:id", userController.delete);



/**
 * POST /login
 * @summary Post user infos
 * @tags Post
 * @return {[Post]} 200 - success response - application/json
 * @return {ApiError} 400 - Bad request response - application/json
 */
router.post("/login", userController.login);

module.exports = router;
