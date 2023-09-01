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
      "a1z2e3r4t5y6u7i8o9p0q1s2d3f4g5h6j7k8l9m0w1x2c3v4b5n6m7a8z9e0r1t2y3u4i5o6p7q8s9d0f1g2h3j4k5l6m7w8x9c0v1b2n3m4a5z6e7r8t9y0u1i2o3p4q5s6d7f8g9h0j1k2l3m4w5x6c7v8b9n0m",
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 100, // 20 minutes
    },
  })
);

// Liaison avec les routeurs
const router = require("./router");
app.use(router);

module.exports = app;
