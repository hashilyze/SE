const mysql = require("mysql2/promise");
const pool = require("../database/mysql_pool");


/**
 * @param {(conn: mysql.PoolConnection)=>Promise} cb 
 * @returns {Promise}
 */
exports.transactionWrapper = async function(cb){
    const conn = await pool.promise().getConnection();
    let results = { };
    try {
        await conn.beginTransaction();
        results = await cb(conn);
        await conn.commit();
    } catch (err) {
        await conn.rollback();
        console.log(err);
        throw { kind: "server_error" };
    } finally {
        conn.release();
    }
    return results;
};