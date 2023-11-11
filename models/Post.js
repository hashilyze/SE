const mysql = require("mysql2");
const pool = require("../database/mysql_pool");
const { transactionWrapper } = require("./utility");


class Post {
    constructor({pid, title, 
        writer, category, format,
        writer_name, category_name, format_name,
        description, price, images,
        created_at, views, likes, downloads}) {

        this.pid = pid;
        this.title = title;

        this.writer = writer;
        this.category = category;
        this.format = format;

        this.writer_name = writer_name;
        this.category_name = category_name;
        this.format_name = format_name;

        this.description = description;
        this.price = price;
        this.images = images;

        this.created_at = created_at;
        this.views = views;
        this.likes = likes;
        this.downloads = downloads;
    }
};


async function updateImagesById(conn, id, images) {
    let delete_sql = `DELETE FROM Post_Image WHERE pid = ?`;
    let insert_sql = `INSERT INTO Post_Image(pid, img_id, name) VALUES\n`;
    images.map((val, idx) => {
        if (idx != 0) insert_sql += ','
        insert_sql += mysql.format("(?, ?, ?)\n", [id, idx, val]);
    });

    await conn.query(delete_sql, [id]);
    let affected = 0;
    if(images && images.length > 0){
        var [rows, fileds] = await conn.query(insert_sql);
        affected = rows.affectedRows;
    }
    console.log(`Stored ${affected} images`);
};


/**
 * @param {Post} newPost 
 * @returns {Promise<Number>} insertId
 */
Post.create = async function (newPost) {
    let sql = `
    INSERT INTO Post 
    SET 
        title = ?, 
        writer = ?, 
        category = ?, 
        format = ?,
        description = ?, 
        price = ?
    `;
    let vals = [newPost.title, 
        newPost.writer, newPost.category, newPost.format,
        newPost.description, newPost.price];
    
    let rows = await transactionWrapper(async (conn) => {
        var [rows, fields] = await conn.query(sql, vals);
        if(rows.affectedRows > 0 && newPost.images && newPost.images.length > 0)
            await updateImagesById(conn, rows.insertId, newPost.images);
        return rows;
    });

    console.log(`Created post{ pid: ${rows.insertId}}`);
    return rows.insertId;
}


/**
 * @param {Int} id 
 */
Post.findById = async function (id) {
    let sql = "SELECT * FROM XPost WHERE pid = ?";
    let rows = await transactionWrapper(async (conn) => (await conn.query(sql, [id]))[0]);

    if (rows.length == 0) {
        console.error(`Can not found post{ pid: ${id} }`);
        throw { kind: "not_found" };
    } else {
        console.log(`Found post{ pid: ${id} }`);
        return new Post(rows[0]);
    }
};
Post.existById = async function(id) {
    try{
        await Post.findById(id);
        console.log(`Exsit post { pid: ${id} }`);
        return true;
    }catch(err){
        console.log(`Not exsit post { pid: ${id} }`);
        return false;
    }
};


/**
 * @param {{
 *   key: String, order: "ASC" | "DESC"
 * , limit: Number, offset: Number
 * , title: String, description: String
 * , min_price: Number, max_price: Number
 * , writer: Number | Array, writer_name: String | Array
 * , category: Number | Array, category_name: String | Array
 * , format: Number | Array, format_name: String | Array
 * }} filter
 * @returns {Promist<Post[]>}
 */
Post.findAll = async function (filter) {
    let elvis = (value, alter) => value ? mysql.escape(value) : alter;
    if(!filter) filter = { };
    let sql = `
    SELECT * FROM XPost 
    WHERE title LIKE IFNULL(CONCAT('%', ?, '%'), title)
        AND description LIKE IFNULL(CONCAT('%', ?, '%'), description)
        AND price BETWEEN IFNULL(?, 0) AND IFNULL(?, POW(2, 31))
        
        AND writer IN (${elvis(filter.writer, "writer")})
        AND category IN (${elvis(filter.category, "category")})
        AND format IN (${elvis(filter.format, "format")})

        AND writer_name IN (${elvis(filter.writer_name, "writer_name")})
        AND category_name IN (${elvis(filter.category_name, "category_name")})
        AND format_name IN (${elvis(filter.format_name, "format_name")})
    ORDER BY ?? ${filter.order || "ASC"}
    LIMIT ? OFFSET ?
    `;
    let vals = [
        filter.title, filter.description,
        filter.min_price, filter.max_price,
        (filter.key || "pid"),
        (filter.limit || 2**31), (filter.offset || 0)
    ];
    
    let rows = await transactionWrapper(async (conn) => (await conn.query(sql, vals))[0])

    console.log(`Found ${rows.length} posts`);
    return rows.map((val) => new Post(val));
}


/**
 * @param {Int} id 
 * @param {Post} post
 */
Post.updateById = async function (id, post) {
    let sql = `
    UPDATE Post
    SET 
        title = IFNULL(?, title), 

        writer = IFNULL(?, writer), 
        category = IFNULL(?, category), 
        format = IFNULL(?, format), 

        description = IFNULL(?, description),
        price = IFNULL(?, price),

        created_at = IFNULL(?, created_at),
        views = IFNULL(?, views),
        likes = IFNULL(?, likes),
        downloads = IFNULL(?, downloads)
    WHERE pid = ?
    `;
    let vals = [post.title, 
        post.writer, post.category, post.format,
        post.description, post.price, 
        post.created_at, 
        post.views, post.likes, post.downloads, 
        id];

    let rows = await transactionWrapper(async (conn) => {
        var [rows, fields] = await conn.query(sql, vals);
        if(rows.affectedRows > 0 && post.images)
            await updateImagesById(conn, id, post.images);
        return rows;
    });

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
Post.deleteById = async function (id) {
    let sql = `DELETE FROM Post WHERE pid = ?`;
    let rows = await transactionWrapper(async (conn) => (await conn.query(sql, [id]))[0]);

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
    let sql = `UPDATE Post SET ?? = ?? + ? WHERE pid = ?`;
    let vals = [column, column, val, id];
    let rows = await transactionWrapper(async (conn) => (await conn.query(sql, vals))[0]);

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
