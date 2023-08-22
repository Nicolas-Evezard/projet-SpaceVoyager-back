/********************************/
/* Paramétrage de l'application */
/********************************/

// import du module Express
const express = require("express");
const cors = require("cors");

// déclaration de notre app Express
const app = express();

// Activation du format JSON
app.use(express.json());

// Mise en place des CORS
app.use(cors());

// This is cors configuration part. May not be worth to use - To delete if not usefull
/* const corsOptions = {
  origin: 'http://spacevoyager.fr',
  optionsSuccessStatus: 200
} */

// Configuration des sessions
const session = require("express-session");
app.use(
  session({
    secret:
      "je mets n'importequoi mais plus c'est long et mieux sécurisé ça sera",
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 20, // 20 minutes
    },
  })
);

// Liaison avec les routeurs
const router = require("./router");
app.use(router);

module.exports = app;
