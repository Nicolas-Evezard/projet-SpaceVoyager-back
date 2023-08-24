// Module de gestion d'erreur
const errorHandler = require("../service/errorHandler");

// Import des routeurs
const bookingRouter = require("./booking");
const hostelRouter = require("./hostel");
const planetRouter = require("./planet");
const userRouter = require("./user");

// Déclaration du routeur principal
const express = require("express");
const mainRouter = express.Router();

// Aiguillage pour les routes préfixées par /booking
mainRouter.use("/booking", bookingRouter);

// Aiguillage pour les routes préfixées par /hostel
mainRouter.use("/hostel", hostelRouter);

// Aiguillage pour les routes préfixées par /planet
mainRouter.use("/planet", planetRouter);

// Aiguillage pour les routes préfixées par /user
mainRouter.use("/user", userRouter);

mainRouter.use(errorHandler.manage);

module.exports = mainRouter;
