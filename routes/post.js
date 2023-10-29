// Import
const express = require("express");
const path = require("path");
const multer = require("multer");
const Post = require("../lib/Post");

const router = express.Router();
router.parent_url = "/board"
router.root_url = "/board/post"


const upload = multer({ storage: multer.diskStorage({
    destination(req, file, cb){
        cb(null, "public/post_images/");
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


// 게시물 작성
router.get('/write', (req, res)=>{ res.render("write"); });

router.post("/create",  upload.array("img"), (req, res)=>{    
    var newPost = {
        title: req.body.title,
        writer: 1,
        category: 1,
        content: req.body.content,
        images: (req.files.length > 0 ? [{ mid: 0, url: req.files[0].filename }] : null),
    };
    Post.create(newPost, (err, post) => {
        if(err){
            res.status(500).send({message: err.message || "Error occured while create post"});
            return;
        }
        res.redirect(router.root_url + `/read/${post.pid}`);
    });
});


// 게시물 열람
router.get('/read/:pid', (req, res)=>{
    let pid = parseInt(req.params.pid);

    Post.updateViewById(pid, (err) => {
        if(err){
            res.status(500).send("Can not found post");
            return;
        }
        Post.findById(pid, (err, post) => {
            if(err){
                res.status(500).send("Can not found post");
                return;
            }
            res.render("view", post);
        });
    });
});
router.get("/read/:pid/upvote", (req, res)=>{
    Post.updateLikeById(req.params.pid, (err) => {
        if(err){
            res.status(500).send("Can not found post");
            return;
        }
        res.redirect(router.root_url + `/read/${req.params.pid}`);
    })
});


// 게시물 수정
router.get('/edit/:pid', (req, res) => {
    let pid = parseInt(req.params.pid);
    Post.findById(pid, (err, post) => {
        if(err){
            res.status(500).send("Can not found post");
            return;
        }
        res.render("edit", {
            pid: post.pid,
            title: post.title,
            author: post.writer,
            content: post.content,
            image_name: post.images ? post.images[0].url : "no_image.jpg",
        });
    })
});
router.post('/update', upload.array("img"), (req, res) => {
    let post = {
        title: req.body.title,
        writer: 1,
        category: 1,
        content: req.body.content,
        images: null,
        //image_name: req.files.length > 0 ? req.files[0].filename : undefined
    };
    Post.updateById(req.body.pid, post, (err) => {
        if(err){
            res.status(500).send("error occured");
            return;
        }
        res.redirect(router.root_url + `/read/${req.body.pid}`);
    })
});


// 게시물 삭제
router.post('/delete', (req, res)=>{
    Post.deleteById(req.body.pid, (err)=>{
        if(err){
            res.status(500).send("Error occured");
            return;
        }
        res.redirect(router.parent_url);
    });
});

module.exports=router;