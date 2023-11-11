const pool = require("../database/mysql_pool");
const { transactionWrapper } = require("./utility");


class Download {
    constructor({ uid, pid, logged_at }) {
        this.uid = uid;
        this.pid = pid;
        this.logged_at = logged_at;
    }
};


/**
 * @param {Download} newDownload
 * @returns {Promise<Number>} insertId
 */
Download.create = async function (newDownload) {
    let sql = "REPLACE INTO User_Download SET uid = ?, pid = ?";
    let vals = [newDownload.uid, newDownload.pid];
    await transactionWrapper(async (conn) => (await conn.query(sql, vals))[0]);

    console.log(`Created download{ uid: ${newDownload.uid}, pid: ${newDownload.pid} }`);
};


/**
 * @param {pid: Number, uid: Number} id
 */
Download.findById = async function (id) {
    let sql = `SELECT * FROM User_Download WHERE uid = ? AND pid = ?`;
    let vals = [id.uid, id.pid];
    let rows = await transactionWrapper(async (conn) => (await conn.query(sql, vals))[0]);

    if (rows.length == 0) {
        console.error(`Can not found download{ uid: ${id.uid}, pid: ${id.pid} }`);
        throw { kind: "not_found" };
    } else {
        console.log(`Found download{ uid: ${id.uid}, pid: ${id.pid} }`);
        return new Download(rows[0]);
    }
};


/**
 * @param {{pid: Number, uid: Number}} filter
 * @return {Promise<Download[]>}
 */
Download.findAll = async function (filter) {
    if (!filter) filter = {};
    let sql = `
    SELECT * FROM User_Download
    WHERE uid = IFNULL(?, uid) AND pid = IFNULL(?, pid)
    `;
    let vals = [filter.uid, filter.pid];
    let rows = await transactionWrapper(async (conn) => (await conn.query(sql, vals))[0]);

    console.log(`Found ${rows.length} downloads`);
    return rows.map((val) => new Download(val));
};


/**
 * @param { pid: Number, uid: Number} id
 */
Download.deleteById = async function (id) {
    let sql = `DELETE FROM User_Download WHERE uid = ? AND pid = ?`;
    let vals = [id.uid, id.pid];
    let rows = await transactionWrapper(async (conn) => (await conn.query(sql, vals))[0]);
    
    if (rows.affectedRows == 0) {
        console.error(`Error: there is not download{ uid: ${id.uid}, pid: ${id.pid} }`);
        throw { kind: "not_found" };
    } else {
        console.log(`Deleted download{ uid: ${id.uid}, pid: ${id.pid} }`);
        return true;
    }
}


module.exports = Download;