const connection = require("../database/mysql_connection");

const mysql = require("mysql2");
const db_config = require('../database/db_config.json');
const pool = mysql.createPool(db_config);


class Category {
    constructor({ cid, name }) {
        this.cid = cid;
        this.name = name;
    }
};


/**
 * @param {Category} newCategory
 * @returns {Promise<Number>} insertId
 */
Category.create = async function (newCategory) {
    const conn = await pool.promise().getConnection();
    let sql = "INSERT INTO Category SET name = ?";

    try {
        await conn.beginTransaction();
        var [rows, fields] = await conn.query(sql, [newCategory.name]);
        await conn.commit();
    } catch (err) {
        await conn.rollback();
        console.log(err);
        throw { kind: "server_error" };
    } finally {
        conn.release();
    }
    console.log(`Created category{ cid: ${rows.insertId} }`);
    return rows.insertId;
};


async function findOne(column, key) {
    const conn = await pool.promise().getConnection();
    const sql = "Select * FROM Category WHERE ?? = ?";

    try {
        await conn.beginTransaction();
        var [rows, fields] = await conn.query(sql, [column, key]);
        await conn.commit();
    } catch (err) {
        await conn.rollback();
        console.log(err)
        throw { kind: "server_error" };
    } finally {
        conn.release();
    }

    if (rows.length == 0) {
        console.log(`Can not found category{ ${column}: ${key} }`);
        throw { kind: "not_found" };
    } else {
        console.log(`Found category{ ${column}: ${key} }`);
        return new Category(rows[0]);
    }
};


Category.findById = async (id) => findOne("cid", id);
Category.findByName = async (name) => findOne("name", name);


/**
 * @param {{name: String}} filter
 * @returns {Promise<Category[]>}
 */
Category.findAll = async function (filter) {
    if (!filter) filter = {};
    const conn = await pool.promise().getConnection();
    let sql = `
    Select * 
    FROM Category 
    WHERE name LIKE IFNULL(CONCAT('%', ?, '%'), name)
    ORDER BY cid ASC
    `;

    try {
        await conn.beginTransaction();
        var [rows, fields] = await conn.query(sql, [filter.name]);
        await conn.commit();
    } catch (err) {
        await conn.rollback();
        console.log(err);
        throw { kind: "server_error" };
    } finally {
        conn.release();
    }
    console.log(`Found ${rows.length} categories`);
    return rows.map((val) => new Category(val));
};


/**
 * @param {Number} id 
 * @param {Category} category
 */
Category.updateById = async function (id, category) {
    const conn = await pool.promise().getConnection();
    let sql = `
    UPDATE Category 
    SET 
        name = IFNULL(?, name)
    WHERE cid = ?
    `;

    try {
        await conn.beginTransaction();
        var [rows, fields] = await conn.query(sql, [category.name, id]);
        await conn.commit();
    } catch (err) {
        await conn.rollback();
        console.log(err);
        throw { kind: "server_error" };
    } finally {
        conn.release();
    }

    if (rows.affectedRows == 0) {
        console.error(`Error: there is not category{ cid: ${id} }`);
        throw { kind: "not_found" };
    } else {
        console.log(`Updated category{ cid: ${id} }`);
        return true;
    }
};


/**
 * @param {Number} id 
 */
Category.deleteById = async function (id) {
    const conn = await pool.promise().getConnection();
    let sql = `DELETE FROM Category WHERE cid = ?`;

    try {
        await conn.beginTransaction();
        var [rows, fields] = await conn.query(sql, [id]);
        await conn.commit();
    } catch (err) {
        await conn.rollback();
        console.log(err);
        cb({ ...err, kind: "server_error" }, null);
    } finally {
        conn.release();
    }

    if (rows.affectedRows == 0) {
        console.error(`Error: there is not category{ cid: ${id} }`);
        throw { kind: "not_found" };
    } else {
        console.log(`Deleted category{ cid: ${id} }`);
        return true;
    }
};


module.exports = Category;