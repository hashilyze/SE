// Import
const express = require("express");
const path = require("path");
const multer = require("multer");
const Post = require("../models/Post");
const postController = require("../controllers/postController");

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


// 게시물 생성
router.post("/", postController.create);
// 게시물 검색
router.get("/search", postController.findAll);
// 게시물 가져오기
router.get("/:pid", postController.findOne);
// 게시물 정보 수정
router.put("/:pid", postController.updateOne);
// 게시물 삭제
router.delete("/:pid", postController.deleteOne);


// 게시물 작성
router.get('/write', (req, res)=>{ res.render("write"); });

router.post("/create", upload.array("img"), async (req, res)=>{ 
    var newPost = {
        title: req.body.title,
        writer: 1,
        category: 1,
        description: req.body.content,
        price: 0,
        images: req.files.map((val) => val.filename),
    };

    try{
        let id = await Post.create(newPost);
        res.redirect(router.root_url + `/read/${id}`);
    }catch(err){
        console.log(err);
        res.status(500).send("Error occured while create post");
    }
});


// 게시물 열람
router.get('/read/:pid', async (req, res)=>{
    let pid = parseInt(req.params.pid);

    try{
        await Post.addViewsById(req.params.pid, 1);
        let post = await Post.findById(pid);
        res.render("view", post);
    }catch(err){
        res.status(500).send("Can not found post");
    }
});
router.get("/read/:pid/upvote", async (req, res)=>{
    try{
        await Post.addLikesById(req.params.pid, 1);
        res.redirect(router.root_url + `/read/${req.params.pid}`);
    }catch(err){
        res.status(500).send("Can not found post");
    }
});


// 게시물 수정
router.get('/edit/:pid', async (req, res) => {
    let pid = parseInt(req.params.pid);
    try {
        let post = await Post.findById(pid);
        res.render("edit", {
            pid: post.pid,
            title: post.title,
            author: post.writer_name,
            content: post.description,
            image_name: post.images ? post.images[0] : "no_image.jpg",
        });
    } catch(err){
        res.status(500).send("Can not found post");
    }
});
router.post('/update', upload.array("img"), async (req, res) => {
    let post = {
        title: req.body.title,
        writer: 1,
        category: 1,
        description: req.body.content,
        images: req.files.map((val) => val.filename),
    };

    try{
        await Post.updateById(req.body.pid, post);
        res.redirect(router.root_url + `/read/${req.body.pid}`);
    } catch(err){
        console.log(err);
        res.status(500).send("error occured");
    }
});


// 게시물 삭제
router.post('/delete', async (req, res)=>{
    try{
        await Post.deleteById(req.body.pid);
        res.redirect(router.parent_url);
    } catch(err){
        res.status(500).send("Error occured");
    }
});

module.exports=router;