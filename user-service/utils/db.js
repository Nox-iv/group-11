const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.AMLUSERSERVICE_DB,
});

async function getConnection() {
  const client = await pool.connect();
  return client;
}

module.exports = {
  query: (text, params) => pool.query(text, params),
  getConnection,
};