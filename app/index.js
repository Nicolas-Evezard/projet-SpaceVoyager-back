/********************************/
/* Paramétrage de l'application */
/********************************/

// import du module Express
const express = require("express");
const cors = require("cors");

// import de swagger
const expressJSDocSwagger = require("express-jsdoc-swagger");

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

// Configuration of swagger APIdoc
const options = {
  info: {
    version: "1.0.0",
    title: "Space Voyager",
    license: {
      name: "MIT",
    },
  },
  security: {
    BasicAuth: {
      type: "http",
      scheme: "basic",
    },
  },
  // Base directory which we use to locate your JSDOC files
  baseDir: __dirname,
  // Glob pattern to find your jsdoc files (multiple patterns can be added in an array)
  filesPattern: "./**/*.js",
  // URL where SwaggerUI will be rendered
  swaggerUIPath: "/docs",
  // Expose OpenAPI UI
  exposeSwaggerUI: true,
  // Expose Open API JSON Docs documentation in `apiDocsPath` path.
  exposeApiDocs: false,
  // Open API JSON Docs endpoint.
  apiDocsPath: "/api-docs",
  // Set non-required fields as nullable by default
  notRequiredAsNullable: false,
  // You can customize your UI options.
  // you can extend swagger-ui-express config. You can checkout an example of this
  // in the `example/configuration/swaggerOptions.js`
  swaggerUiOptions: {},
  // multiple option in case you want more that one instance
  multiple: true,
};

expressJSDocSwagger(app)(options);

// Liaison avec les routeurs
const router = require("./router");
app.use(router);

module.exports = app;
