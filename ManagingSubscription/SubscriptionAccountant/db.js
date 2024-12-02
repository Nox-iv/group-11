 
const { Pool } = require('pg');  

 
const pool = new Pool({
  user: 'postgres',         
  host: 'localhost',             
  database: 'subscription',       
  password: 'SuperUser1811',  
  port: 5433,                    
});

module.exports = pool;   
