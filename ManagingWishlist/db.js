// db.js
const { Pool } = require('pg');  

// Configure PostgreSQL connection
const pool = new Pool({
  user: 'postgres',         
  host: 'localhost',             
  database: 'wishlist',       
  password: 'SuperUser1811',  
  port: 5433,                    
});

module.exports = pool;   
