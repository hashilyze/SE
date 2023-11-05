const connection = require("../database/mysql_connection");

const mysql = require("mysql2");
const db_config = require('../database/db_config.json');
const pool = mysql.createPool(db_config);


class Post {
    constructor({pid, title, writer, category, 
        description, price, 
        created_at, views, likes, downloads, 
        writer_name, category_name, images}) {

        this.pid = pid;
        this.title = title;
        this.writer = writer;
        this.category = category;

        this.description = description;
        this.price = price;

        this.created_at = created_at;
        this.views = views;
        this.likes = likes;
        this.downloads = downloads;

        this.writer_name = writer_name;
        this.category_name = category_name;
        this.images = images;
    }
};


async function updateImagesById(conn, id, images) {
    let delete_sql = `DELETE FROM Post_Image WHERE pid = ?`;
    let insert_sql = `INSERT INTO Post_Image(pid, img_id, name) VALUES\n`;
    images.map((val, idx) => {
        if (idx != 0) sql += ','
        insert_sql += mysql.format("(?, ?, ?)\n", [id, idx, val]);
    });

    await conn.query(delete_sql, [id]);
    let [rows, fileds] = await conn.query(insert_sql);
    console.log(`Stored ${rows.affectedRows} images`);
    return true;
};


/**
 * @param {Post} newPost 
 * @returns {Promise<Number>} insertId
 */
Post.create = async function (newPost, cb) {
    const conn = await pool.promise().getConnection();
    let sql = `
    INSERT INTO Post 
    SET 
        title = ?, 
        writer = ?, 
        category = ?, 
        description = ?, 
        price = ?
    `;
    let vals = [newPost.title, newPost.writer, newPost.category,
        newPost.description, newPost.price];
    
    try{
        await conn.beginTransaction();
        var [rows, fields] = await conn.query(sql, vals);
        if(newPost.images && newPost.images.length > 0)
            await updateImagesById(conn, rows.insertId, newPost.images);
        await conn.commit();
    }catch(err){
        conn.rollback();
        console.log(err);
        cb({ ...err, kind: "server_error" }, null);
    }finally{
        conn.release();
    }
    console.log(`Created post{ pid: ${rows.insertId}}`);
    return rows.insertId;
}


/**
 * @param {Int} id 
 */
Post.findById = async function (id) {
    const conn = await pool.promise().getConnection();
    let sql = "SELECT * FROM XPost WHERE pid = ?";

    try {
        await conn.beginTransaction();
        var [rows, fields] = await conn.query(sql, [id]);
        await conn.commit();
    } catch (err) {
        await conn.rollback();
        console.log(err)
        throw { kind: "server_error" };
    } finally {
        conn.release();
    }

    if (rows.length == 0) {
        console.log(`Can not found post{ pid: ${id} }`);
        throw { kind: "not_found" };
    } else {
        console.log(`Found post{ pid: ${id} }`);
        return new Post(rows[0]);
    }
}


/**
 * @param {{key: String
 * , order: "ASC" | "DESC"
 * , limit: Number
 * , offset: Number
 * , title: String, description: String
 * , min_price: Number, max_price: Number
 * , category: Number | Array, writer: Number | Array
 * , category_name: String | Array, writer_name: String | Array
 * }} filter
 * @returns {Promist<Post[]>}
 */
Post.findAll = async function (filter) {
    const conn = await pool.promise().getConnection();
    if(!filter) filter = { };
    let sql = `
    SELECT * FROM XPost 
    WHERE title LIKE ${filter.title ? mysql.escape("%"+filter.title+"%") : "title"}
        AND description LIKE ${ filter.description ? `"%${filter.description}%"` : "description"}
        AND price BETWEEN ${filter.min_price || 0} AND ${filter.max_price || 2**31 }
        AND writer IN (${filter.writer ? mysql.escape(filter.writer) : "writer"})
        AND category IN (${filter.category ? mysql.escape(filter.category) : "category"})
        AND writer_name IN (${filter.writer_name ? mysql.escape(filter.writer_name) : "writer_name"})
        AND category_name IN (${filter.category_name ? mysql.escape(filter.category_name) : "category_name"})
    ORDER BY ${filter.key || "pid"} ${filter.order || "ASC"}
    LIMIT ${filter.limit || 2**31} OFFSET ${filter.offset || 0}
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
    console.log(`Found ${rows.length} posts`);
    return rows.map((val) => new Post(val));
}


/**
 * @param {Int} id 
 * @param {Post} post
 */
Post.updateById = async function (id, post) {
    const conn = await pool.promise().getConnection();
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
    WHERE pid = ?
    `;
    let vals = [post.title, post.writer, post.category,
        post.description, post.price, post.created_at,
        post.views, post.likes, post.downloads, id];

    try {
        await conn.beginTransaction();
        var [rows, fields] = await conn.query(sql, vals);
        if(post.images && post.images.length > 0)
            await updateImagesById(conn, id, post.images);
        await conn.commit();
    } catch (err) {
        await conn.rollback();
        console.log(err);
        throw { kind: "server_error" };
    } finally {
        conn.release();
    }

    if (rows.affectedRows == 0) {
        console.error(`Error: there is not post{ pid: ${id} }`);
        throw { kind: "not_found" };
    } else {
        console.log(`Updated category{ pid: ${id} }`);
        return true;
    }
}


/**
 * @param {Number} id 
 */
Post.deleteById = async function (id, cb) {
    const conn = await pool.promise().getConnection();
    let sql = `DELETE FROM Post WHERE pid = ?`;

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
        console.error(`Error: there is not post{ pid: ${id} }`);
        throw { kind: "not_found" };
    } else {
        console.log(`Deleted post{ pid(${id} }`);
        return true;
    }
}


/**
 * @param {Number} id 
 * @param {Number} val
 * @param {String} column
 */
async function addValueById(id, val, column) {
    const conn = await pool.promise().getConnection();
    let sql = `UPDATE Post SET ?? = ?? + ? WHERE pid = ?`;
    let vals = [column, column, val, id];
    
    try{
        await conn.beginTransaction();
        var [rows, fields] = await conn.query(sql, vals);
        await conn.commit();
    }catch(err){
        await conn.rollback();
        console.log(err);
        throw { kind: "server_error" };
    } finally{
        conn.release();
    }

    if (rows.affectedRows == 0) {
        console.error(`Error: there is not post{ pid: ${id} }`);
        throw { kind: "not_found" };
    } else {
        console.log(`Updated post(${id})'s ${column}`);
        return true;
    }
};


Post.addViewsById = async (id, val) => addValueById(id, val, "views");
Post.addLikesById = async (id, val) => addValueById(id, val, "likes");
Post.addDownloadsById = async (id, val) => addValueById(id, val, "downloads");


module.exports = Post;