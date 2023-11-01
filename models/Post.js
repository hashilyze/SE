const connection = require("../database/mysql_connection");
const mysql = require("mysql2");


class Post {
    constructor(post) {
        this.pid = post.pid;
        this.title = post.title;
        this.writer = post.writer;
        this.category = post.category;

        this.description = post.description;
        this.price = post.price;

        this.created_at = post.created_at;
        this.views = post.views;
        this.likes = post.likes;
        this.downloads = post.downloads;

        this.writer_name = post.writer_name;
        this.category_name = post.category_name;
        this.images = post.images;
    }
};


Post.updateImagesById = function(id, images, cb) {
    connection((conn) => {
        conn.query(`DELETE FROM Post_Image WHERE pid = ${mysql.escape(id)}`, (error, results) => {
            if(error){
                console.error("Error: " + error);
                cb(error);
            } else if(images && images.length > 0) {
                let sql = "INSERT INTO Post_Image(pid, img_id, name) VALUES";
                images.map((val, idx) => {
                    if (idx != 0) sql += ','
                    sql += `(${mysql.escape(id)}, ${mysql.escape(idx)}, "${mysql.escape(val)}")\n`;
                });
                
                conn.query(sql, (error, results) => {
                    if(error){
                        console.error("Error: " + error);
                        cb(error);
                    } else {
                        console.log(`Stored ${results.affectedRows} images`);
                        cb(null);
                    }
                });
            } else{
                cb(error);
            }
        });
    });
}


/**
 * @param {Post} newPost 
 * @param {(err: import("mysql2").QueryError, post: Post)=>any} cb 
 */
Post.create = function (newPost, cb) {
    connection((conn) => {
        let sql_create_post = `INSERT INTO Post 
            SET title = ?, writer = ?, category = ?, description = ?, price = ?`;
        let vals = [newPost.title, newPost.writer, newPost.category,
            newPost.description, newPost.price];

        conn.query(sql_create_post, vals, (error, results) => {
            if (error) {
                console.error("Error: " + error);
                cb(error, null);
            } else {
                let pid = results.insertId;
                console.log(`Created post{ pid: ${pid}}`);
                
                Post.updateImagesById(pid, newPost.images, (error) => {
                    if(error) {
                        cb(error, null);
                    } else {
                        cb(null, { ...newPost, pid: pid });
                    }
                });
            }
        });
        conn.release();
    });
}


/**
 * @param {Int} id 
 * @param {(err: import("mysql2").QueryError, post: Post)=>any} cb 
 */
Post.findById = function (id, cb) {
    let sql = `SELECT * FROM XPost WHERE pid = ${mysql.escape(id)}`;
    connection((conn) => {
        conn.query(sql, (error, results) => {
            if (error) {
                console.error("Error: " + error);
                cb(error, null);
            } else if (results.length == 0) {
                console.log(`Can not found post{ pid: ${id} }`);
                cb({ message: "not found" }, null);
            } else {
                console.log(`Found post: ${results[0].pid}`);
                cb(null, results[0]);
            }
        });
        conn.release();
    });
}


/**
 * @param {{key: String, order: "ASC" | "DESC", limit: Number, offset: Number
 * , title: String, description: String
 * , min_price: Number, max_price: Number
 * , category: Number | Array, writer: Number | Array
 * , category_name: String | Array, writer_name: String | Array
 * }} options 
 * @param {(err: import("mysql2").QueryError, posts: Post[])=>any} cb 
 */
Post.findAll = function (cb, options) {
    if(!options) options = { };
    let sql = `
    SELECT * FROM XPost 
    WHERE title LIKE ${options.title ? mysql.escape("%"+options.title+"%") : "title"}
        AND description LIKE ${ options.description ? `"%${options.description}%"` : "description"}
        AND price BETWEEN ${options.min_price || 0} AND ${options.max_price || 2**31 }
        AND writer IN (${options.writer ? mysql.escape(options.writer) : "writer"})
        AND category IN (${options.category ? mysql.escape(options.category) : "category"})
        AND writer_name IN (${options.writer_name ? mysql.escape(options.writer_name) : "writer_name"})
        AND category_name IN (${options.category_name ? mysql.escape(options.category_name) : "category_name"})
    ORDER BY ${options.key ? mysql.escapeId(options.key) : "pid"} ${options.order ? mysql.escapeId(options.order) : "ASC"}
    LIMIT ${options.limit || 2**31} OFFSET ${options.offset || 0}
    `;
    let vals = []

    connection((conn) => {
        conn.query(sql, vals, (error, results) => {
            if (error) {
                console.error(error);
                cb(error, null);
            } else {
                console.log(`Found ${results.length} posts`);
                cb(null, results);
            }
        });
        conn.release();
    });
}


/**
 * @param {Int} id 
 * @param {Post} post
 * @param {(err: import("mysql2").QueryError)=>any} cb 
 */
Post.updateById = function (id, post, cb) {
    connection((conn) => {
        let sql = `
        UPDATE Post 
        SET 
            title = IFNULL(?, title), 
            writer = IFNULL(?, writer), 
            category = IFNULL(?, category), 
            description = IFNULL(?, description),
            price = IFNULL(?, price),
            created_at = IFNULL(?, created_at),
            views = IFNULL(?, views),
            likes = IFNULL(?, likes),
            downloads = IFNULL(?, downloads)
        WHERE pid = ${mysql.escape(id)}
        `;
        let vals = [post.title, post.writer, post.category,
            post.description, post.price, post.created_at,
            post.views, post.likes, post.downloads];

        conn.query(sql, vals, (error, results) => {
            if (error) {
                console.error("Error: ", error);
                cb(error);
            } else if (results.affectedRows == 0) {
                console.error(`Error: there is not post{ pid: ${id} }`);
                cb({ message: "not found" });
            } else {
                if(post.images === undefined) {
                    cb(null);
                } else{
                    Post.updateImagesById(id, post.images, (error) => {
                        if(error) {
                            cb(error, null);
                        } else {
                            cb(null);
                        }
                    });
                }                
            }
        });
        conn.release();
    });
}


/**
 * @param {Number} id 
 * @param {(err: import("mysql2").QueryError) => any} cb 
 */
Post.deleteById = function (id, cb) {
    connection((conn) => {
        let sql = `DELETE FROM Post WHERE pid = ${mysql.escape(id)}`;
        conn.query(sql, (error, results) => {
            if (error) {
                console.log("Error: " + error);
                cb(error);
            } else if (results.affectedRows == 0) {
                console.error(`Error: there is not post{ pid: ${id} }`);
                cb({ message: "not found" });
            } else {
                console.log(`Deleted post{ pid(${id} }`);
                cb(null);
            }
        });
        conn.release();
    });
}


/**
 * @param {Number} id 
 * @param {Number} val
 * @param {String} column
 * @param {(err: import("mysql2").QueryError)=>any} cb 
 */
function addValueById(id, val, column, cb) {
    connection((conn) => {
        let sql = `UPDATE Post SET ?? = ?? + ? WHERE pid = ${mysql.escape(id)}`;
        let vals = [column, column, val];
        conn.query(sql, vals, (error, results) => {
            if (error) {
                console.error("Error: ", error);
                cb(null, error);
            } else if (results.affectedRows == 0) {
                console.error(`Error: there is not post{ pid: ${id} }`);
                cb({ message: "not found" });
            } else {
                console.log(`Updated post(${id})'s ${column}`);
                cb(null);
            }
        });
        conn.release();
    });
};


/**
 * @param {Number} id 
 * @param {Number} val 
 * @param {(err: import("mysql2").QueryError)=>any} cb 
 */
Post.addViewsById = function (id, val, cb) {
    addValueById(id, val, "views", cb);
}
/**
 * @param {Number} id 
 * @param {Number} val 
 * @param {(err: import("mysql2").QueryError)=>any} cb 
 */
Post.addLikesById = function (id, val, cb) {
    addValueById(id, val, "likes", cb);
}
/**
 * @param {Number} id 
 * @param {Number} val 
 * @param {(err: import("mysql2").QueryError)=>any} cb 
 */
Post.addDownloadsById = function (id, val, cb) {
    addValueById(id, val, "downloads", cb);
}


module.exports = Post;
