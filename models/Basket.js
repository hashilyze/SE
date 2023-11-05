const connection = require("../database/mysql_connection");

const mysql = require("mysql2");
const db_config = require('../database/db_config.json');
const pool = mysql.createPool(db_config);


class Basket {
    constructor({ uid, pid }) {
        this.uid = uid;
        this.pid = pid;
    }
};


/**
 * @param {Basket} newBasket
 * @returns {Promise<Number>} insertId
 */
Basket.create = async function (newBasket) {
    const conn = await pool.promise().getConnection();
    let sql = "INSERT INTO Basket SET uid = ?, pid = ?";

    try {
        await conn.beginTransaction();
        var [rows, fields] = await conn.query(sql, [newCategory.uid, newCategory.pid]);
        await conn.commit();
    } catch (err) {
        await conn.rollback();
        console.log(err);
        throw { kind: "server_error" };
    } finally {
        conn.release();
    }
    console.log(`Created basket{ uid: ${newBasket.uid}, pid: ${newBasket.pid} }`);
    return rows.insertId;
};


/**
 * @param {pid: Number, uid: Number} id
 */
Basket.findById = async function (id) {
    const conn = await pool.promise().getConnection();
    let sql = `Select * FROM Basket WHERE uid = ? AND pid = ?`;

    try {
        await conn.beginTransaction();
        var [rows, fields] = await conn.query(sql, [id.uid, id.pid]);
        await conn.commit();
    } catch (err) {
        await conn.rollback();
        console.log(err)
        throw { kind: "server_error" };
    } finally {
        conn.release();
    }

    if (rows.length == 0) {
        console.log(`Can not found basket{ uid: ${id.uid}, pid: ${id.pid} }`);
        throw { kind: "not_found" };
    } else {
        console.log(`Found basket{ uid: ${id.uid}, pid: ${id.pid} }`);
        return new Category(rows[0]);
    }
};



/**
 * @param {{pid: Number, uid: Number}} filter
 */
Basket.findAll = async function (filter) {
    if (!filter) filter = {};
    const conn = await pool.promise().getConnection();
    let sql = `
    Select * 
    FROM Basket
    WHERE uid = IFNULL(?, uid) AND pid = IFNULL(?, pid)
    `;

    try {
        await conn.beginTransaction();
        var [rows, fields] = await conn.query(sql, [filter.uid, filter.pid]);
        await conn.commit();
    } catch (err) {
        await conn.rollback();
        console.log(err);
        throw { kind: "server_error" };
    } finally {
        conn.release();
    }

    console.log(`Found ${rows.length} baskets`);
    return rows.map((val) => new Basket(val));
};


/**
 * @param { pid: Number, uid: Number} id
 */
Basket.deleteById = async function (id, cb) {
    const conn = await pool.promise().getConnection();
    let sql = `DELETE FROM Basket WHERE uid = ? AND pid = ?`;

    try {
        await conn.beginTransaction();
        var [rows, fields] = await conn.query(sql, [id.uid, id.pid]);
        await conn.commit();
    } catch (err) {
        await conn.rollback();
        console.log(err);
        cb({ ...err, kind: "server_error" }, null);
    } finally {
        conn.release();
    }
    if (rows.affectedRows == 0) {
        console.error(`Error: there is not basket{ uid: ${id.uid}, pid: ${id.pid} }`);
        throw { kind: "not_found" };
    } else {
        console.log(`Deleted basket{ uid: ${id.uid}, pid: ${id.pid} }`);
        return true;
    }
}


module.exports = Basket;
