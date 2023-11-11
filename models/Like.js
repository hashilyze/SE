const pool = require("../database/mysql_pool");
const { transactionWrapper } = require("./utility");


class Like {
    constructor({ uid, pid, logged_at }) {
        this.uid = uid;
        this.pid = pid;
        this.logged_at = logged_at;
    }
};


/**
 * @param {Like} newLike
 * @returns {Promise<Number>} insertId
 */
Like.create = async function (newLike) {
    let sql = "REPLACE INTO User_Like SET uid = ?, pid = ?";
    let vals = [newLike.uid, newLike.pid];
    await transactionWrapper(async (conn) => (await conn.query(sql, vals))[0]);

    console.log(`Created like{ uid: ${newLike.uid}, pid: ${newLike.pid} }`);
};


/**
 * @param {pid: Number, uid: Number} id
 */
Like.findById = async function (id) {
    let sql = `SELECT * FROM User_Like WHERE uid = ? AND pid = ?`;
    let vals = [id.uid, id.pid];
    let rows = await transactionWrapper(async (conn) => (await conn.query(sql, vals))[0]);

    if (rows.length == 0) {
        console.error(`Can not found like{ uid: ${id.uid}, pid: ${id.pid} }`);
        throw { kind: "not_found" };
    } else {
        console.log(`Found like{ uid: ${id.uid}, pid: ${id.pid} }`);
        return new Like(rows[0]);
    }
};


/**
 * @param {{pid: Number, uid: Number}} filter
 * @return {Promise<Like[]>}
 */
Like.findAll = async function (filter) {
    if (!filter) filter = {};
    let sql = `
    SELECT * FROM User_Like
    WHERE uid = IFNULL(?, uid) AND pid = IFNULL(?, pid)
    `;
    let vals = [filter.uid, filter.pid];
    let rows = await transactionWrapper(async (conn) => (await conn.query(sql, vals))[0]);

    console.log(`Found ${rows.length} likes`);
    return rows.map((val) => new Like(val));
};


/**
 * @param { pid: Number, uid: Number} id
 */
Like.deleteById = async function (id) {
    let sql = `DELETE FROM User_Like WHERE uid = ? AND pid = ?`;
    let vals = [id.uid, id.pid];
    let rows = await transactionWrapper(async (conn) => (await conn.query(sql, vals))[0]);
    
    if (rows.affectedRows == 0) {
        console.error(`Error: there is not like{ uid: ${id.uid}, pid: ${id.pid} }`);
        throw { kind: "not_found" };
    } else {
        console.log(`Deleted like{ uid: ${id.uid}, pid: ${id.pid} }`);
        return true;
    }
}


module.exports = Like;