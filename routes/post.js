const express = require("express");
const path = require("path");
const mysql = require('mysql2');
const multer = require("multer");
const moment = require("moment");

const router = express.Router();
router.parent_url = "/board"
router.root_url = "/board/post"

const db_template = require("../lib/db_template");

const upload = multer({ storage: multer.diskStorage({
    destination(req, file, cb){
        cb(null, "public/images/");
    },
    filename(req, file, cb){
        const ext = path.extname(file.originalname);
        cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    }
}),
    limits: { filesize: 128 * 1024 * 1024 }, // 최대 128MB
    fileFilter: (req, file, cb) =>{
        if(file.mimetype == "image/png" 
            || file.mimetype == "image/jpeg"
            || file.mimetype == "image/gif"){
            cb(null, true)
        } else{
            cb({msg: "이미지만 가능합니다."}, false);
        }
    }
});


// 게시물 열람
router.get('/read/:pid', (req, res)=>{
    if(isNaN(req.params.pid)) {
        res.redirect(router.parent_url);
        return;
    }

    const connection = mysql.createConnection(db_template);
    const lookupState = `
        SELECT * 
        FROM board 
        WHERE pid=${req.params.pid}
    `;
    // 조회수 갱신
    const countViewState = `
        UPDATE board 
        SET views = views + 1 
        WHERE pid=${req.params.pid}
    `;
    connection.connect();
    connection.query(lookupState, function(err, lookupData) {
        if(err) console.log(err);
        if(lookupData.length <= 0){
            res.redirect(router.parent_url);
            connection.end();
            return;
        }
        connection.query(countViewState, function(err, countData){
            if(err) console.log(err);

            lookupData[0].views += 1;
            res.render("view", lookupData[0]);
            connection.end();
        });
    });
});
router.get("/read/:pid/upvote", (req, res)=>{
    const connection = mysql.createConnection(db_template);
    // 추천수 갱신
    const state = `
        UPDATE board 
        SET votes = votes + 1 
        WHERE pid=${req.params.pid}
    `;
    connection.query(state, function(err, data){
        if(err) console.log(err);
        res.redirect(router.root_url + `/read/${req.params.pid}`);
        connection.end();
    });

});


// 게시물 작성
router.get('/write', (req, res)=>{
    res.render("write");
});

router.post("/create",  upload.array("img"), (req, res)=>{    
    var filename = "no_image.jpg";
    if(req.files !== undefined) filename = req.files[0].filename;

    const state = `
        INSERT INTO board(author, pw, category, title, content, image_name, regist_date)
        VALUES (
            "${req.body.author}", 
            "${req.body.pw}", 
            "미분류",
            "${req.body.title}",
            "${req.body.content}",
            "${filename}",
            "${moment().format("YYYY-MM-DD HH:mm:ss")}"
        )
    `;
    const connection = mysql.createConnection(db_template);
    connection.connect();
    connection.query(state, (err, data) => {
        if(err) console.log(err);
        res.redirect(router.root_url + `/read/${data.insertId}`);
    });
});


// 게시물 수정
router.get('/edit/:pid', (req, res) => {
    if(isNaN(req.params.pid) || req.params.pid < 0){
        res.redirect(router.root_url);
        return;
    }
    const connection = mysql.createConnection(db_template);
    const lookupState = `
        SELECT * 
        FROM board 
        WHERE pid=${req.params.pid}
    `;
    connection.connect();
    connection.query(lookupState, (err, data) => {
        if(err) console.log(err);
        if(data.length < 1) {
            res.redirect(router.parent_url);
            connection.end();
        }
        res.render("edit", {
            pid: data[0].pid,
            title: data[0].title,
            author: data[0].author,
            content: data[0].content,
            image_name: data[0].image_name,
        });
        connection.end();
    });
});
router.post('/update', upload.array("img"), (req, res) => {
    var state = `
        UPDATE board
        SET
        author = "${req.body.author}",
        pw = "${req.body.pw}",
        category = "미분류",
        title = "${req.body.title}",
        content = "${req.body.content}"`;
    console.log(req.files);
    if(req.files.length > 0) {
        state += `,\nimage_name = "${req.files[0].filename}"`;
    }
    state += `\nWHERE pid = ${req.body.pid}`;
    console.log(state);

    const connection = mysql.createConnection(db_template);
    connection.connect();
    connection.query(state, (err, data) => {
        if(err) console.log(err);
        res.redirect(router.root_url + `/read/${req.body.pid}`);
    });
});



// 게시물 삭제
router.post('/delete', (req, res)=>{
    const state = `
        DELETE FROM board
        WHERE pid = ${req.body.pid}
    `;
    const connection = mysql.createConnection(db_template);
    connection.connect();
    connection.query(state, (err, data) => {
        if(err) console.log(err);   
        res.redirect(router.parent_url);
    });
});

module.exports=router;