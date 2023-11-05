const connection = require("../database/mysql_connection");

const mysql = require("mysql2");
const db_config = require('../database/db_config.json');
const pool = mysql.createPool(db_config);


class User {
    constructor({ uid, role, login_id, password, name, created_at }) {
        this.uid = uid;
        this.role = role;
        this.login_id = login_id;
        this.password = password;
        this.name = name;
        this.created_at = created_at;
    }
};


/**
 * @param {User} newUser 
 * @returns {Promise<Number>} insertId
 */
User.create = async function (newUser) {
    const conn = await pool.promise().getConnection();
    let sql = `
    INSERT INTO User 
    SET 
        login_id = ?, 
        password = ?, 
        name = ?,
        role = IFNULL(?, 0)
    `;
    let vals = [newUser.login_id, newUser.password, newUser.name, newUser.role];

    try {
        await conn.beginTransaction();
        var [rows, fields] = await conn.query(sql, vals);
        await conn.commit();
    } catch (err) {
        await conn.rollback();
        console.log(err);
        throw { kind: "server_error" };
    } finally {
        conn.release();
    }
    console.log(`Created user{ uid: ${rows.insertId} }`);
    return rows.insertId;
};


async function findOne(column, key) {
    const conn = await pool.promise().getConnection();
    const sql = "Select * FROM User WHERE ?? = ?";

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
        console.log(`Can not found user{ ${column}: ${key} }`);
        throw { kind: "not_found" };
    } else {
        console.log(`Found user{ ${column}: ${key} }`);
        return new User(rows[0]);
    }
};


User.findById = async (id) => findOne("uid", id);


/**
 * @param {{name: String}} filter
 * @returns {Promise<User[]>}
 */
User.findAll = async function (filter) {
    if (!filter) filter = {};
    const conn = await pool.promise().getConnection();
    let sql = `
    Select * 
    FROM User 
    WHERE name LIKE IFNULL(CONCAT('%', ?, '%'), name)
    ORDER BY uid ASC
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
    console.log(`Found ${rows.length} users`);
    return rows.map((val) => new User(val));
};


/**
 * @param {Number} id 
 * @param {User} user
 */
User.updateById = async function (id, user) {
    const conn = await pool.promise().getConnection();
    let sql = `
    UPDATE User 
    SET 
        role = IFNULL(?, role),
        login_id = IFNULL(?, login_id),
        password = IFNULL(?, password),
        name = IFNULL(?, name),
        created_at = IFNULL(?, created_at)
    WHERE uid = ?
    `;
    let vals = [user.role, user.login_id, user.password,
    user.name, user.created_at, id];

    try {
        await conn.beginTransaction();
        var [rows, fields] = await conn.query(sql, vals);
        await conn.commit();
    } catch (err) {
        await conn.rollback();
        console.log(err);
        throw { kind: "server_error" };
    } finally {
        conn.release();
    }

    if (rows.affectedRows == 0) {
        console.error(`Error: there is not user{ uid: ${id} }`);
        throw { kind: "not_found" };
    } else {
        console.log(`Updated user{ uid: ${id} }`);
        return true;
    }
};


/**
 * @param {Number} id 
 * @param {(err: import("mysql2").QueryError) => any} cb 
 */
User.deleteById = async function (id, cb) {
    const conn = await pool.promise().getConnection();
    let sql = `DELETE FROM User WHERE uid = ?`;

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
        console.error(`Error: there is not user{ uid: ${id} }`);
        throw { kind: "not_found" };
    } else {
        console.log(`Deleted user{ uid: ${id} }`);
        return true;
    }
};
module.exports = User;
