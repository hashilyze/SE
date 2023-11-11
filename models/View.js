const pool = require("../database/mysql_pool");
const { transactionWrapper } = require("./utility");


class View {
    constructor({ uid, pid, logged_at }) {
        this.uid = uid;
        this.pid = pid;
        this.logged_at = logged_at;
    }
};


/**
 * @param {View} newView
 * @returns {Promise<Number>} insertId
 */
View.create = async function (newView) {
    let sql = "REPLACE INTO User_View SET uid = ?, pid = ?";
    let vals = [newView.uid, newView.pid];
    await transactionWrapper(async (conn) => (await conn.query(sql, vals))[0]);

    console.log(`Created view{ uid: ${newView.uid}, pid: ${newView.pid} }`);
};


/**
 * @param {pid: Number, uid: Number} id
 */
View.findById = async function (id) {
    let sql = `SELECT * FROM User_View WHERE uid = ? AND pid = ?`;
    let vals = [id.uid, id.pid];
    let rows = await transactionWrapper(async (conn) => (await conn.query(sql, vals))[0]);

    if (rows.length == 0) {
        console.error(`Can not found view{ uid: ${id.uid}, pid: ${id.pid} }`);
        throw { kind: "not_found" };
    } else {
        console.log(`Found view{ uid: ${id.uid}, pid: ${id.pid} }`);
        return new View(rows[0]);
    }
};


/**
 * @param {{pid: Number, uid: Number}} filter
 * @return {Promise<View[]>}
 */
View.findAll = async function (filter) {
    if (!filter) filter = {};
    let sql = `
    SELECT * FROM User_View
    WHERE uid = IFNULL(?, uid) AND pid = IFNULL(?, pid)
    `;
    let vals = [filter.uid, filter.pid];
    let rows = await transactionWrapper(async (conn) => (await conn.query(sql, vals))[0]);

    console.log(`Found ${rows.length} views`);
    return rows.map((val) => new View(val));
};


/**
 * @param { pid: Number, uid: Number} id
 */
View.deleteById = async function (id) {
    let sql = `DELETE FROM User_View WHERE uid = ? AND pid = ?`;
    let vals = [id.uid, id.pid];
    let rows = await transactionWrapper(async (conn) => (await conn.query(sql, vals))[0]);
    
    if (rows.affectedRows == 0) {
        console.error(`Error: there is not view{ uid: ${id.uid}, pid: ${id.pid} }`);
        throw { kind: "not_found" };
    } else {
        console.log(`Deleted view{ uid: ${id.uid}, pid: ${id.pid} }`);
        return true;
    }
}


module.exports = View;