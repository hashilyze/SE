const mysql = require('mysql2');
const db_config = require('./db_config.json');
const pool = mysql.createPool(db_config);

/**
 * @param {(conn: import('mysql2').PoolConnection)=>any} cb 
 */
async function getConnection(cb) {
    pool.getConnection((err, conn) => {
        if(err) throw err;
        cb(conn);
    })
}

module.exports = getConnection;