// REQUIRE MODULES
const express = require("express");

// REQUIRE MIDDLEWARE
const errorHandler = require("../service/errorHandler");

// REQUIRE ROUTERS
const bookingRouter = require("./booking");
const hostelRouter = require("./hostel");
const planetRouter = require("./planet");
const userRouter = require("./user");

// DEFINE ROUTER WITH EXPRESS
const mainRouter = express.Router();

// Routing for routes prefixed by /booking
mainRouter.use("/booking", bookingRouter);

// Routing for routes prefixed by /hostel
mainRouter.use("/hostel", hostelRouter);

// Routing for routes prefixed by /planet
mainRouter.use("/planet", planetRouter);

// Routing for routes prefixed by /user
mainRouter.use("/user", userRouter);

// Middleware to manage error
mainRouter.use(errorHandler.manage);

module.exports = mainRouter;
