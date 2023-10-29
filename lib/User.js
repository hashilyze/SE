const connection = require("./mysql_connection");

class User {
    consturctor(user){
        this.uid = user.uid;
        this.id = user.id;
        this.password = user.password;
        this.name = user.name;
    }
};


/**
 * @param {User} newUser 
 * @param {(err: import("mysql2").QueryError, user: User) => any} cb 
 */
User.create = function(newUser, cb){
    connection((conn) => {
        let sql = "INSERT INTO user SET id = ?, password = ?, name = ?";
        let vals = [newUser.id, newUser.password, newUser.name];

        conn.query(sql, vals, (err, res) => {
            if(err){
                console.log("error: ", err);
                cb(err, null);
                return;
            }
            console.log(`Created user: uid(${res.insertId})`);
            cb(null, {uid: res.insertId, ...newUser});
        });
        conn.release();
    });
};

/**
 * @param {Number} id 
 * @param {(err: import("mysql2").QueryError, user: User) => any} cb 
 */
User.findById = function(id, cb){
    connection((conn) => {
        let sql = `Select * FROM user WHERE uid = ${id}`;
        conn.query(sql, (err, res) => {
            if(err){
                console.log("error: ", err);
                cb(err, null);
                return;
            }
            if(res.length){
                console.log(`Found user: uid(${res[0].uid})`);
                cb(null, res[0]);
            } else {
                console.log(`Can not found user(${id})`);
                cb({message: "not found"}, null);
            }
        });
        conn.release();
    });
};
/**
 * @param {(err: import("mysql2").QueryError, users: User[]) => any} cb 
 */
User.findAll = function(cb){
    connection((conn) => {
        let sql = `Select * FROM user`;
        conn.query(sql, (err, res) => {
            if(err){
                console.log("error: ", err);
                cb(err, null);
                return;
            }
            console.log(`Found ${res.length} users`);
            cb(null, res);
        });
        conn.release();
    });
};

/**
 * @param {Number} id 
 * @param {User} user
 * @param {(err: import("mysql2").QueryError, user: User) => any} cb 
 */
User.updateById = function(id, user, cb){
    connection((conn) => {
        let sql = "UPDATE user SET id = ?, password = ?, name = ? WHERE uid = ?";
        let vals = [user.id, user.password, user.name, id];

        conn.query(sql, vals, (err, res) => {
            if(err){
                console.log("error: ", err);
                cb(err, null);
                return;
            }
            if(res.affectedRows > 0){
                console.log(`Updated user: uid(${id})`);
                cb(null, { uid: id, ...user});
            } else {
                console.log(`error: there is not user(${id})`);
                cb({message: "not found"}, null);
            }
        });
        conn.release();
    });
}

/**
 * @param {Number} id 
 * @param {(err: import("mysql2").QueryError) => any} cb 
 */
User.deleteById = function(id, cb){
    connection((conn) => {
        let sql = `DELETE FROM user WHERE uid = ${id}`;
        conn.query(sql, (err, res) => {
            if(err){
                console.log("error: ", err);
                cb(err);
                return;
            }
            if(res.affectedRows > 0){
                console.log(`Delete users: uid(${id})`);
                cb(null);
                return;
            } else {
                console.log(`error: there is not user(${id})`);
                cb({message: "not found"});
            }
        });
        conn.release();
    });
}

module.exports = User;
