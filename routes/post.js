// Import
const express = require("express");
const path = require("path");
const multer = require("multer");
const moment = require("moment");
const db_handler = require("../lib/db_api");

const router = express.Router();
router.parent_url = "/board"
router.root_url = "/board/post"


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
    model.upviewPostById(req.params.pid, (data) => {
        model.getPostById(req.params.pid, (data) => {
            if(data.length < 1){
                res.redirect(router.parent_url);
            } else {
                res.render("view", data[0]);
            }
        })
    });
});
router.get("/read/:pid/upvote", (req, res)=>{
    model.upvotePostById(req.params.pid, (data) => {
        res.redirect(router.root_url + `/read/${req.params.pid}`);
    })
});


// 게시물 작성
router.get('/write', (req, res)=>{
    res.render("write");
});

router.post("/create",  upload.array("img"), (req, res)=>{    
    var record = {
        author: req.body.author,
        pw: req.body.pw,
        category: "미분류",
        title: req.body.title,
        content: req.body.content,
        filename: (req.files.length > 0 ? req.files[0].filename : "no_image.jpg"),
        date: moment().format("YYYY-MM-DD HH:mm:ss"),
    };
    db_handler.createPost(record, (data) => {
        res.redirect(router.root_url + `/read/${data.insertId}`);
    })
});


// 게시물 수정
router.get('/edit/:pid', (req, res) => {
    if(isNaN(req.params.pid) || req.params.pid < 0){
        res.redirect(router.root_url);
        return;
    }
    db_handler.getPostById(req.params.pid, (data) => {
        if(data.length < 1) {
            res.redirect(router.parent_url);
        } else {
            res.render("edit", {
                pid: data[0].pid,
                title: data[0].title,
                author: data[0].author,
                content: data[0].content,
                image_name: data[0].image_name,
            });
        }
    })
});
router.post('/update', upload.array("img"), (req, res) => {
    var record = {
        author: req.body.author,
        pw: req.body.pw,
        category: "미분류",
        title: req.body.title,
        content: req.body.content,
        image_name: req.files.length > 0 ? req.files[0].filename : undefined
    };
    db_handler.updatePostById(req.body.pid, record, () => {
        res.redirect(router.root_url + `/read/${req.body.pid}`);
    });
});


// 게시물 삭제
router.post('/delete', (req, res)=>{
    db_handler.deletePostById(req.body.pid, ()=>{
        res.redirect(router.parent_url);
    });
});

module.exports=router;