const express = require("express");
const mysql = require('mysql2');

const postRouter = require("./post");

const router = express.Router();
router.parent_url = "/";
router.root_url = "/board";

const db_template = require("../lib/db_template");


router.use("/post", postRouter);


// 게시물 목록 열람
router.get("/", (req, res) => { 
    res.redirect(router.root_url+"/0"); 
});

router.get('/:page',(req,res) => {
    if(isNaN(req.params.page) || req.params.page < 0) { 
        res.redirect(router.root_url);
        return;
    }
    const limit = 10;
    const state = `
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
        LIMIT ${limit} OFFSET ${req.params.page * limit}
    `;
    const connection = mysql.createConnection(db_template);
    connection.connect();
    connection.query(state, function(err, data) {
        if(err) console.log(err);
        res.render("list", { 
            page: Number(req.params.page),
            posts: data,
        });
        connection.end();
    });
});

module.exports=router;