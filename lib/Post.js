const connection = require("./mysql_connection");

class Post {
    consturctor(post){
        this.pid = post.pid;
        this.title = post.title;
        this.writer = post.writer;
        this.category = post.category;

        this.content = post.content;
        this.images = post.images;

        this.reg_date = post.reg_date;
        this.views = post.views;
        this.downloads = post.downloads;
        this.likes = post.likes;
    }
};


/**
 * @param {Post} newPost 
 * @param {(err: import("mysql2").QueryError, post: Post)=>any} cb 
 */
Post.create = function(newPost, cb) {
    connection((conn) => {
        let sql_create_post = `
        INSERT INTO post SET 
            title = "${newPost.title}", 
            writer = ${newPost.writer}, 
            category = ${newPost.category}, 
            content = "${newPost.content}"
        `;
        conn.query(sql_create_post, (err, res) => {
            if(err) {
                console.log("error: " + err);
                cb(err, null);
                return;
            }
            let pid = res.insertId;
            console.log("Created post:", pid);
            if(newPost.images && newPost.images.length > 0){
                var sql_create_img = "INSERT INTO image(pid, mid, url) VALUES";
                newPost.images.map((val, idx) => { sql_create_img += `(${pid}, ${idx}, "${val.url}")`; });

                conn.query(sql_create_img, (err, res) => {
                    if(err) {
                        console.log(err);
                        cb(err, null);
                        return;
                    }
                    console.log(`Stored ${res.affectedRows} images`);
                    cb(null, { pid: pid, ...newPost});
                });
            } else {
                cb(null, { pid: pid, ...newPost});
            }
        });
        conn.release();
    });
}


/**
 * @param {Int} id 
 * @param {(err: import("mysql2").QueryError, post: Post)=>any} cb 
 */
Post.findById = function(id, cb){
    let sql = `
    SELECT post.pid, post.title, 
        post.writer, user.name AS writer_name,
        post.category, category.name AS category_name,
        post.content,
        post.reg_date, post.views, post.likes, post.downloads
    FROM post, user, category
    WHERE pid = ${id} AND writer = user.uid AND post.category = category.cid
    `;
    connection((conn) => {
        conn.query(sql, (err, res) => {
            if(err){
                console.log("error: " + err);
                cb(err, null);
                return;
            }
            if(!res.length){
                cb({ message: "not found" }, null);
                return;
            }
            console.log(`Found post: ${res[0].pid}`);
            let post = res[0];
            conn.query(`SELECT * FROM image WHERE pid = ${id}`, (err, res) => {
                if(err){
                    console.log("error: " + err);
                    cb(err, null);
                    return;
                }
                post.images = res.length > 0 ? res : null;
                cb(null, post);
            });
        });
        conn.release();
    });
}

/**
 * @param {{key: String, order: "ASC" | "DESC", limit: Number, offset: Number}} options 
 * @param {(err: import("mysql2").QueryError, headers: Post[])=>any} cb 
 */
Post.findHeadersByRange = function(options, cb){
    var sql = `
    SELECT post.pid, post.title, 
        post.writer, user.name AS writer_name,
        post.category, category.name AS category_name,
        post.reg_date, post.views, post.likes, post.downloads
    FROM post, user, category
    WHERE post.writer = user.uid AND post.category = category.cid
    ORDER BY ${options.key || "pid"} ${options.order || "ASC"}
    LIMIT ${options.limit || 2^31} OFFSET ${options.offset || 0}
    `;
    connection((conn) => {
        conn.query(sql, (err, res) => {
            if(err){
                console.log(err);
                cb(err, null);
                return;
            }
            cb(null, res);
        }); 
    });
}


/**
 * @param {Int} id 
 * @param {Post} post
 * @param {(err: import("mysql2").QueryError, post: Post)=>any} cb 
 */
Post.updateById = function(id, post, cb) {
    connection((conn) => {
        let sql = `UPDATE post SET title = ?, writer = ?, category = ?, content = ? WHERE pid = ${id}`;
        let vals = [post.title, post.writer, post.category, post.content];
        conn.query(sql, vals, (err, res) => {
            if(err){
                console.log("error: ", err);
                cb(err, null);
                return;
            }
            if(res.affectedRows > 0){
                console.log(`Updated post: pid(${id})`);
                if(post.images && post.images.length > 0){
                    // no implemented
                }
                cb(null, { pid: id, ...post });
            } else {
                console.log(`error: there is not post(${id})`);
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
Post.deleteById = function(id, cb) {
    connection((conn) => {
        let sql = `DELETE FROM post WHERE pid = ${id}`;
        conn.query(sql, (err, res) => {
            if(err) {
                console.log("error: " + err);
                cb(err);
                return;
            }
            if(res.affectedRows > 0){
                console.log(`Delete post: pid(${id})`);
                cb(null);
            } else {
                console.log(`error: there is not post(${id})`);
                cb({message: "not found"});
            }
        });
        conn.release();
    });
}

/**
 * @param {Int} id 
 * @param {(err: import("mysql2").QueryError)=>any} cb 
 */
Post.updateViewById = function(id, cb) {
    connection((conn) => {
        let sql = `UPDATE post SET views = views + 1 WHERE pid = ${id}`;
        conn.query(sql, (err, res) => {
            if(err){
                console.log("error: ", err);
                cb(null, err)
                return;
            }
            if(res.affectedRows > 0){
                console.log(`Updated post(${id})'s views`);
                cb(null);
            } else{
                console.log(`error: there is not post(${id})`);
                cb({message: "not found"});
            }
        });
        conn.release();
    });
}

/**
 * @param {Int} id 
 * @param {(err: import("mysql2").QueryError)=>any} cb 
 */
Post.updateLikeById = function(id, cb) {
    connection((conn) => {
        let sql = `UPDATE post SET likes = likes + 1 WHERE pid = ${id}`;
        conn.query(sql, (err, res) => {
            if(err){
                console.log("error: ", err);
                cb(null, err)
                return;
            }
            if(res.affectedRows > 0){
                console.log(`Updated post(${id})'s likes`);
                cb(null);
            } else{
                console.log(`error: there is not post(${id})`);
                cb({message: "not found"});
            }
        });
        conn.release();
    });
}

module.exports = Post;
