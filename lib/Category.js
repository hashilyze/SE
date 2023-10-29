const connection = require("./mysql_connection");

class Category {
    consturctor(category){
        this.cid = category.cid;
        this.name = category.name;
    }
};


/**
 * @param {Category} newCategory
 * @param {(err: import("mysql2").QueryError, category: Category) => any} cb 
 */
Category.create = function(newCategory, cb){
    connection((conn) => {
        let sql = `INSERT INTO category SET name = ${newCategory.name}`;
        conn.query(sql, (err, res) => {
            if(err){
                console.log("error: ", err);
                cb(err, null);
                return;
            }
            console.log(`Created cateogory: cid(${res.insertId})`);
            cb(null, {cid: res.insertId, ...newCategory});
        });
        conn.release();
    });
};


/**
 * @param {Number} id 
 * @param {(err: import("mysql2").QueryError, category: Category) => any} cb 
 */
Category.findById = function(id, cb){
    connection((conn) => {
        let sql = `Select * FROM category WHERE cid = ${id}`;
        conn.query(sql, (err, res) => {
            if(err){
                console.log("error: ", err);
                cb(err, null);
                return;
            }
            if(res.length){
                console.log(`Found category: cid(${res[0].cid})`);
                cb(null, res[0]);
            } else{
                console.log(`Can not found category(${id})`);
                cb({message: "not found"}, null);
            }
        });
        conn.release();
    });
};
/**
 * @param {String} name
 * @param {(err: import("mysql2").QueryError, category: Category) => any} cb 
 */
Category.findByName = function(name, cb){
    connection((conn) => {
        let sql = `Select * FROM category WHERE name = "${name}"`;
        conn.query(sql, (err, res) => {
            if(err){
                console.log("error: ", err);
                cb(err, null);
                return;
            }
            if(res.length){
                console.log(`Found category: cid(${res[0].cid})`);
                cb(null, res[0]);
                return;
            } else {
                console.log(`Can not found category(${id})`);
                cb({message: "not found"}, null);
            }
        });
        conn.release();
    });
};
/**
 * @param {(err: import("mysql2").QueryError, categories: Category[]) => any} cb 
 */
Category.findAll = function(cb){
    connection((conn) => {
        let sql = `Select * FROM category ORDER BY cid`;
        conn.query(sql, (err, res) => {
            if(err){
                console.log("error: ", err);
                cb(err, null);
                return;
            }
            console.log(`Found ${res.length} categories`);
            cb(null, res);
        });
        conn.release();
    });
};


/**
 * @param {Number} id 
 * @param {Category} category
 * @param {(err: import("mysql2").QueryError, category: Category) => any} cb 
 */
Category.updateById = function(id, category, cb){
    connection((conn) => {
        let sql = "UPDATE category SET name = ? WHERE cid = ?";
        let vals = [category.name, id];

        conn.query(sql, vals, (err, res) => {
            if(err){
                console.log("error: ", err);
                cb(null, err)
                return;
            }
            if(res.affectedRows > 0){
                console.log(`Updated category: cid(${id})`);
                cb(null, { cid: id, ...category});
            } else{
                console.log(`error: there is not category(${id})`);
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
Category.deleteById = function(id, cb){
    connection((conn) => {
        let sql = `DELETE FROM category WHERE cid = ${id}`;
        conn.query(sql, (err, res) => {
            if(err){
                console.log("error: ", err);
                cb(err);
                return;
            }
            if(res.affectedRows > 0){
                console.log(`Delete category: cid(${id})`);
                cb(null);
            } else {
                console.log(`error: there is not category(${id})`);
                cb({message: "not found"});
            }
        });
        conn.release();
    });
}

module.exports = Category;
