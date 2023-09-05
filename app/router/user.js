const express = require("express");
const router = express.Router();
const validationService = require("../service/validation/validationService");

const { userController } = require("../controller");

/**
 * POST /user
 * @summary Post one user
 * @tags User
 * @return {User}
 * @param {InputRegisterUser} request.body.required - user info for register - 200 - success response - application/json
 * @return {ApiError} 500 - Internal server error
 */
router.post("/", validationService.isUser("insert"), userController.register);

/**
 * GET /user
 * @summary Get one user
 * @tags User
 * @param {number} id.path.required - user identifier
 * @return {User} 200 - success response - application/json
 * @return {ApiError} 404 - User not found
 * @return {ApiError} 500 - Internal server error
 */
router.get("/:id(\\d+)", validationService.isConnected, userController.getOne);

/**
 * PATCH /user
 * @summary Patch one user
 * @tags User
 * @param {Number} id.path.required - user identifier
 * @param {InputRegisterUser} request.body.required - user info for patch - application/json
 * @return {User} 200 - success response - application/json
 * @return {ApiError} 500 - Internal server error
 */
router.patch(
  "/:id(\\d+)",
  validationService.isConnected,
  validationService.isUser("update"),
  userController.modifyOne
);

/**
 * DELETE /user
 * @summary Delete one user
 * @tags User
 * @param {Number} id.path.required - user identifier
 * @return {boolean} 200 - success response - true
 * @return {ApiError} 404 - User not found
 * @return {ApiError} 500 - Internal server error
 */
router.delete(
  "/:id(\\d+)",
  validationService.isConnected,
  userController.deleteOne
);

/**
 * POST /login
 * @summary Post user infos
 * @tags User
 * @return {User} 200 - success response - application/json
 * @param {InputLoginUser} request.body.required - user info for login - application/json
 * @return {APIError} 400 - Incorrect mail or password
 * @return {ApiError} 500 - Internal server error
 */
router.post("/login", userController.login);

module.exports = router;
