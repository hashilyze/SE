const mysql = require('mysql2');
const db_config = require('./db_config.json');
const pool = mysql.createPool(db_config);

module.exports = pool;