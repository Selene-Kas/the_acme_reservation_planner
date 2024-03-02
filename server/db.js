const pg = require('pg');
const client = new pg.Client(process.env.DATABSE_URL ||
   'postgres://localhost/acme_reservation_planner_db');

module.exports ={
  client
};

