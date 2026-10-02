const { Pool } = require('pg');
const config = require('./config');

const pool = new Pool({
  ...config.db,
  max: 10,
  ssl: config.env === 'production' ? { rejectUnauthorized: false } : false,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
