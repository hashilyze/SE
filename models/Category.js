const connection = require("../database/mysql_connection");
const mysql = require("mysql2");


class Category {
    constructor(category) {
        this.cid = category.cid;
        this.name = category.name;
    }
};


/**
 * @param {Category} newCategory
 * @param {(err: import("mysql2").QueryError, category: Category) => any} cb 
 */
Category.create = function (newCategory, cb) {
    connection((conn) => {
        let sql = `INSERT INTO Category SET name = "${mysql.escape(newCategory.name)}"`;
        conn.query(sql, (error, results) => {
            if (error) {
                console.error("Error: ", error);
                cb({...error, kind: "server_error"}, null);
            } else {
                console.log(`Created category{ cid: ${results.insertId} }`);
                cb(null, { ...newCategory, cid: results.insertId });
            }
        });
        conn.release();
    });
};


/**
 * @param {Number} id 
 * @param {(err: import("mysql2").QueryError, category: Category) => any} cb 
 */
Category.findById = function (id, cb) {
    connection((conn) => {
        let sql = `Select * FROM Category WHERE cid = ${mysql.escape(id)}`;
        conn.query(sql, (error, results) => {
            if (error) {
                console.error("Error: ", error);
                cb({...error, kind: "server_error"}, null);
            } else if (results.length == 0) {
                console.log(`Can not found category{ cid: ${id} }`);
                cb({ message: "not found", kind: "not_found"}, null);
            } else {
                console.log(`Found category{ cid: ${results[0].cid} }`);
                cb(null, results[0]);
            }
        });
        conn.release();
    });
};


/**
 * @param {String} name
 * @param {(err: import("mysql2").QueryError, category: Category) => any} cb 
 */
Category.findByName = function (name, cb) {
    connection((conn) => {
        let sql = `Select * FROM Category WHERE name = "${mysql.escape(name)}"`;
        conn.query(sql, (error, results) => {
            if (error) {
                console.error("Error: ", error);
                cb({...error, kind: "server_error"}, null);
            } else if (results.length == 0) {
                console.log(`Can not found category(${id})`);
                cb({ message: "not found", kind: "not_found" }, null);
            } else {
                console.log(`Found category{ cid: ${results[0].cid} }`);
                cb(null, results[0]);
            }
        });
        conn.release();
    });
};


/**
 * @param {(err: import("mysql2").QueryError, categories: Category[]) => any} cb 
 */
Category.findAll = function (cb) {
    connection((conn) => {
        let sql = `Select * FROM Category`;
        conn.query(sql, (error, results) => {
            if (error) {
                console.error("Error: ", error);
                cb({...error, kind: "server_error"}, null);
            } else {
                console.log(`Found ${results.length} categories`);
                cb(null, results);
            }
        });
        conn.release();
    });
};


/**
 * @param {Number} id 
 * @param {Category} category
 * @param {(err: import("mysql2").QueryError) => any} cb 
 */
Category.updateById = function (id, category, cb) {
    connection((conn) => {
        let sql = `
        UPDATE category 
        SET 
            name = IFNULL(?, name)
        WHERE cid = ${mysql.escape(id)}`;
        let vals = [category.name];

        conn.query(sql, vals, (error, results) => {
            if (error) {
                console.error("Error: ", error);
                cb({...error, kind: "server_error"})
            } else if (results.affectedRows == 0) {
                console.error(`Error: there is not category{ cid: ${id} }`);
                cb({ message: "not found", kind: "not_found" });
            } else {
                console.log(`Updated category{ cid: ${id} }`);
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
Category.deleteById = function (id, cb) {
    connection((conn) => {
        let sql = `DELETE FROM Category WHERE cid = ${mysql.escape(id)}`;
        conn.query(sql, (error, results) => {
            if (error) {
                console.error("Error: ", error);
                cb({...error, kind: "server_error"});
            } else if (results.affectedRows == 0) {
                console.error(`Error: there is not category{ cid: ${id} }`);
                cb({ message: "not found", kind: "not_found" });
            } else {
                console.log(`Deleted category{ cid: ${id} }`);
                cb(null);
            }
        });
        conn.release();
    });
}

module.exports = Category;