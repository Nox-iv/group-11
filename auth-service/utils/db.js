const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.AMLUSERSERVICE_DB_CONNECTION_STRING,
});

async function getConnection() {
  const client = await pool.connect();
  return client;
}

module.exports = {
  query: (text, params) => pool.query(text, params),
  getConnection,
};