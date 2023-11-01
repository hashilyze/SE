const connection = require("./mysql_connection");
const mysql = require("mysql2");


class User {
    constructor(user) {
        this.uid = user.uid;
        this.role = user.role;
        this.login_id = user.login_id;
        this.password = user.password;
        this.name = user.name;
        this.created_at = user.created_at;
    }
};


/**
 * @param {User} newUser 
 * @param {(err: import("mysql2").QueryError, user: User) => any} cb 
 */
User.create = function (newUser, cb) {
    connection((conn) => {
        let sql = "INSERT INTO User SET login_id = ?, password = ?, name = ?";
        if (newUser.role) sql += `, role = ?`;
        let vals = [newUser.login_id, newUser.password, newUser.name, newUser.role];

        conn.query(sql, vals, (error, results) => {
            if (error) {
                console.error("Error: ", error);
                cb(error, null);
            } else {
                console.log(`Created user{ uid: ${results.insertId} }`);
                cb(null, { ...newUser, uid: results.insertId });
            }
        });
        conn.release();
    });
};


/**
 * @param {Number} id 
 * @param {(err: import("mysql2").QueryError, user: User) => any} cb 
 */
User.findById = function (id, cb) {
    connection((conn) => {
        let sql = `SELECT * FROM User WHERE uid = ${mysql.escape(id)}`;

        conn.query(sql, (error, results) => {
            if (error) {
                console.error("Error: ", error);
                cb(error, null);
            } else if (results.length == 0) {
                console.log(`Can not found user{ uid: ${id} }`);
                cb({ message: "not found" }, null);
            } else {
                console.log(`Found user{ uid: ${results[0].uid} }`);
                cb(null, results[0]);
            }
        });
        conn.release();
    });
};


/**
 * @param {(err: import("mysql2").QueryError, users: User[]) => any} cb 
 */
User.findAll = function (cb) {
    connection((conn) => {
        let sql = `SELECT * FROM User`;
        conn.query(sql, (error, results) => {
            if (error) {
                console.error("Error: ", error);
                cb(error, null);
            } else {
                console.log(`Found ${results.length} users`);
                cb(null, results);
            }
        });
        conn.release();
    });
};


/**
 * @param {Number} id 
 * @param {User} user
 * @param {(err: import("mysql2").QueryError) => any} cb 
 */
User.updateById = function (id, user, cb) {
    connection((conn) => {
        let sql = `
        UPDATE User
        SET
            role = IFNULL(?, role),
            login_id = IFNULL(?, login_id),
            password = IFNULL(?, password),
            name = IFNULL(?, name),
            created_at = IFNULL(?, created_at)
        WHERE uid = ${mysql.escape(id)}`;
        let vals = [user.role, user.login_id, user.password,
        user.name, user.created_at];

        conn.query(sql, vals, (error, results) => {
            if (error) {
                console.error("Error: ", error);
                cb(error);
            } else if (results.affectedRows == 0) {
                console.error(`Error: there is not user{ uid: ${id} }`);
                cb({ message: "not found" });
            } else {
                console.log(`Updated user{ uid: ${id} }`);
                cb(null);
            }
        });
        conn.release();
    });
}


/**
 * @param {Number} id 
 * @param {(err: import("mysql2").QueryError) => any} cb 
 */
User.deleteById = function (id, cb) {
    connection((conn) => {
        let sql = `DELETE FROM User WHERE uid = ${mysql.escape(id)}`;
        conn.query(sql, (error, results) => {
            if (error) {
                console.error("Error: ", error);
                cb(error);
            } else if (results.affectedRows == 0) {
                console.error(`Error: there is not users{ uid: ${id} }`);
                cb({ message: "not found" });
            } else {
                console.log(`Deleted user{ uid: ${id} }`);
                cb(null);
            }
        });
        conn.release();
    });
}
module.exports = User;
