// REQUIRE MODULES
require("dotenv").config({ path: "../../.env" });
const { Pool } = require("pg");

// POOL OF CLIENTS (10)
const client = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  ssl: {
    rejectUnauthorized: false, // désactive la vérification du certificat SSL
  },
});

module.exports = client;
