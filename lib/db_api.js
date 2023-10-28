const mysql = require('mysql2');
const db_config = require('./db_config.json');

const pool = mysql.createPool(db_config);

function getConnection(cb){
    pool.getConnection((err, conn) => {
        if(err) throw err;
        cb(conn);
        
    });
}

model = Object();

// Posts
model.getPostById = (id, cb) => {
    var sql = `
    SELECT * 
    FROM board 
    WHERE pid = ${id}
    `;
    getConnection((conn) => {
        conn.query(sql, (err, data) => {
            if(err) throw err;
            cb(data);
        });
        conn.release();
    });
}

model.deletePostById = (id, cb) => {
    var sql = `
        DELETE FROM board
        WHERE pid = ${id}
    `;
    getConnection((conn) => {
        conn.query(sql, (err, data) => {
            if(err) throw err;
            cb(data);
        });
    });
}

model.createPost = (data, cb) => {
    var sql = `
    INSERT INTO board(author, pw, category, title, content, image_name, regist_date)
    VALUES (
        "${data.author}", 
        "${data.pw}", 
        "${data.category}",
        "${data.title}",
        "${data.content}",
        "${data.filename}",
        "${data.date}"
    )`;
    getConnection((conn) => {
        conn.query(sql, (err, data) => {
            if(err) throw err;
            cb(data);
        });
    });
}
model.updatePostById = (id, data, cb) => {
    var sql = `
    UPDATE board
    SET
    author = "${data.author}", 
    pw = "${data.pw}", 
    category = "${data.category}",
    title = "${data.title}",
    content = "${data.content}"
    ${data.image_name !== undefined ? ",image_name = \"" + data.image_name +"\"" : ""} WHERE pid = ${id}
    `;
    getConnection((conn) => {
        conn.query(sql, (err, data) => {
            if(err) throw err;
            cb(data);
        });
    });
}



model.getPosts = (offset, limit, cb) => {
    var sql = `
    SELECT
        pid AS pid,
        category AS category,
        title AS title,
        author AS author,
        CASE DATE(regist_date) 
            WHEN CURDATE() THEN DATE_FORMAT(regist_date, "%H:%i:%s")
            ELSE DATE_FORMAT(regist_date, "%Y-%m-%d")
        END as regDate,
        views AS views,
        votes AS votes  
    FROM board
    ORDER BY pid desc
    LIMIT ${limit} OFFSET ${offset}`;

    getConnection((conn) => {
        conn.query(sql, (err, data) => {
            if(err) throw err;
            cb(data);
        });
    });
}

model.upvotePostById = (id, cb) => {
    var sql = `
    UPDATE board 
    SET votes = votes + 1 
    WHERE pid=${id}
    `;
    getConnection((conn) => {
        conn.query(sql, (err, data) => {
            if(err) throw err;
            cb(data);
        });
    });
}

model.upviewPostById = (id, cb) => {
    var sql = `
    UPDATE board 
    SET views = views + 1 
    WHERE pid=${id}
    `;
    getConnection((conn) => {
        conn.query(sql, (err, data) => {
            if(err) throw err;
            cb(data);
        });
    });
}

module.exports = model;
