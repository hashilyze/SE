const pool = require("../database/mysql_pool");
const { transactionWrapper } = require("./utility");


class Basket {
    constructor({ uid, pid,
        title,
        writer, category, format,
        writer_name, category_name, format_name,
        description, price, images,
        created_at, views, likes, downloads }) {

        this.uid = uid;
        this.pid = pid;
        this.title = title;

        this.writer = writer;
        this.category = category;
        this.format = format;

        this.writer_name = writer_name;
        this.category_name = category_name;
        this.format_name = format_name;

        this.description = description;
        this.price = price;
        this.images = images;

        this.created_at = created_at;
        this.views = views;
        this.likes = likes;
        this.downloads = downloads;
    }
};


/**
 * @param {Basket} newBasket
 * @returns {Promise<Number>} insertId
 */
Basket.create = async function (newBasket) {
    let sql = "INSERT IGNORE INTO Basket SET uid = ?, pid = ?";
    let vals = [newBasket.uid, newBasket.pid];
    await transactionWrapper(async (conn) => (await conn.query(sql, vals))[0]);

    console.log(`Created basket{ uid: ${newBasket.uid}, pid: ${newBasket.pid} }`);
};


/**
 * @param {pid: Number, uid: Number} id
 */
Basket.findById = async function (id) {
    let sql = `SELECT * FROM XBasket WHERE uid = ? AND pid = ?`;
    let vals = [id.uid, id.pid];
    let rows = await transactionWrapper(async (conn) => (await conn.query(sql, vals))[0]);

    if (rows.length == 0) {
        console.error(`Can not found basket{ uid: ${id.uid}, pid: ${id.pid} }`);
        throw { kind: "not_found" };
    } else {
        console.log(`Found basket{ uid: ${id.uid}, pid: ${id.pid} }`);
        return new Basket(rows[0]);
    }
};


/**
 * @param {{pid: Number, uid: Number}} filter
 * @return {Promise<Basket[]>}
 */
Basket.findAll = async function (filter) {
    if (!filter) filter = {};
    let sql = `
    SELECT * FROM XBasket
    WHERE uid = IFNULL(?, uid) AND pid = IFNULL(?, pid)
    `;
    let vals = [filter.uid, filter.pid];
    let rows = await transactionWrapper(async (conn) => (await conn.query(sql, vals))[0]);

    console.log(`Found ${rows.length} baskets`);
    return rows.map((val) => new Basket(val));
};


/**
 * @param { pid: Number, uid: Number} id
 */
Basket.deleteById = async function (id) {
    let sql = `DELETE FROM Basket WHERE uid = ? AND pid = ?`;
    let vals = [id.uid, id.pid];
    let rows = await transactionWrapper(async (conn) => (await conn.query(sql, vals))[0]);
    
    if (rows.affectedRows == 0) {
        console.error(`Error: there is not basket{ uid: ${id.uid}, pid: ${id.pid} }`);
        throw { kind: "not_found" };
    } else {
        console.log(`Deleted basket{ uid: ${id.uid}, pid: ${id.pid} }`);
        return true;
    }
}


module.exports = Basket;