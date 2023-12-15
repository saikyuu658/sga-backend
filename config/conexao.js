const { Client } = require('pg') 
const config = require('config')
 
const pool = new Client({
  host: config.get('pg.host'),
  user: config.get('pg.user'),
  database: config.get('pg.db'),
  password: config.get('pg.pass'),
  port: config.get('pg.port'),
})

pool.connect();

module.exports = pool;