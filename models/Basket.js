const connection = require("../database/mysql_connection");
const mysql = require("mysql2");


class Basket {
    constructor(basket) {
        this.uid = basket.uid;
        this.pid = basket.pid;
    }
};


/**
 * @param {Basket} newBasket
 * @param {(err: import("mysql2").QueryError, basket: Basket) => any} cb 
 */
Basket.create = function (newBasket, cb) {
    connection((conn) => {
        let sql = `INSERT INTO Basket SET uid = ?, pid = ?`;
        let vals = [newBasket.uid, newBasket.pid];

        conn.query(sql, vals, (error, results) => {
            if (error) {
                console.error("Error: ", error);
                cb(error, null);
            } else {
                console.log(`Created basket{ uid: ${newBasket.uid}, pid: ${newBasket.pid} }`);
                cb(null, newBasket);
            }
        });
        conn.release();
    });
};


/**
 * @param { pid: Number, uid: Number} id
 * @param {(err: import("mysql2").QueryError, basket: Basket) => any} cb 
 */
Basket.findById = function (id, cb) {
    connection((conn) => {
        let sql = `Select * FROM Basket WHERE uid = ? AND pid = ?`;
        let vals = [id.uid, id.pid];

        conn.query(sql, vals, (error, results) => {
            if (error) {
                console.error("Error: ", error);
                cb(error, null);
            } else if (results.length == 0) {
                console.log(`Can not found basket{ uid: ${id.uid}, pid: ${id.pid} }`);
                cb({ message: "not found" }, null);
            } else {
                console.log(`Found basket{ uid: ${id.uid}, pid: ${id.pid} }`);
                cb(null, results[0]);
            }
        });
        conn.release();
    });
};



/**
 * @param {(err: import("mysql2").QueryError, baskets: Basket[]) => any} cb 
 */
Basket.findAll = function (cb) {
    connection((conn) => {
        let sql = `Select * FROM Basket`;
        conn.query(sql, (error, results) => {
            if (error) {
                console.error("Error: ", error);
                cb(error, null);
            } else {
                console.log(`Found ${results.length} baskets`);
                cb(null, results);
            }
        });
        conn.release();
    });
};

/**
 * @param { pid: Number, uid: Number} id
 * @param {(err: import("mysql2").QueryError) => any} cb 
 */
Basket.deleteById = function (id, cb) {
    connection((conn) => {
        let sql = `DELETE FROM Basket WHERE uid = ? AND pid = ?`;
        let vals = [id.uid, id.pid];

        conn.query(sql, vals, (error, results) => {
            if (error) {
                console.error("Error: ", error);
                cb(error);
            } else if (results.affectedRows == 0) {
                console.error(`Error: there is not basket{ uid: ${id.uid}, pid: ${id.pid} }`);
                cb({ message: "not found" });
            } else {
                console.log(`Deleted basket{ uid: ${id.uid}, pid: ${id.pid} }`);
                cb(null);
            }
        });
        conn.release();
    });
}

module.exports = Basket;
