/********************************/
/* Paramétrage de l'application */
/********************************/

// IMPORT
const express = require("express");
const cors = require("cors");
const expressJSDocSwagger = require("express-jsdoc-swagger");

// CONFIG
const app = express();

app.use(express.json());

// This is cors configuration part.
const corsOptions = {
  origin:
    "https://space-voyager-frontMMMMMMMMMMMMMMDDDMMMKLzdzdKKLL.onrender.com",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization", // Specify the allowed <headers></headers>
};

app.use(cors(corsOptions));

// CONFIG SWAGGER
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
  swaggerUiOptions: {},
  // multiple option in case you want more that one instance
  multiple: true,
};

expressJSDocSwagger(app)(options);

// LINKING THE ROUTER
const router = require("./router");
app.use(router);

module.exports = app;
