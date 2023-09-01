// 1 pool de Clients (10 par défaut)
require('dotenv').config({path:'../../.env'});
const { Pool } = require("pg");

const client = new Pool({
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    ssl: {
      rejectUnauthorized: false // désactive la vérification du certificat SSL
    }
  });

module.exports = client;
