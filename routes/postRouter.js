// Import
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Post = require("../models/Post");
const controller = require("../controllers/postController");
const auth = require("../middlewares/auth");
const nullSafty = require("../middlewares/nullSafty");
var decorator = require("./renderDecorator");
// Router
const router = express.Router();

const filePath = 'public/uploads/';

try {
    fs.readdirSync(filePath);
} catch (error) {
    console.error('not exist directory.');
    fs.mkdirSync(filePath);
}

const upload = multer({ storage: multer.diskStorage({
    destination(req, file, cb){
        cb(null, filePath);
    },
    filename(req, file, cb){    
        const ext = path.extname(file.originalname);
        cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    }
}),
    limits: { filesize: 16 * 1024 * 1024 }, // 최대 16MB
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


// 게시물 열람 페이지
router.get("/read/:pid", 
    nullSafty.ensurePost,
    async (req, res) => {
    res.render("details", { post: await Post.findById(req.params.pid) })
});
// 게시물 작성 페이지
router.get("/write", 
    auth.requirePrivate,
    (req, res) => res.render("write", { }));
// 게시물 갱신 페이지
router.get("/edit/:pid", 
    auth.extractWriter,
    auth.requirePrivateOnlyMine,
    async (req, res) => {
        res.render("edit", { post: await Post.findById(req.params.pid) })
});
// 게시판
router.get("/board", async (req, res) => {
    let filter = { 
        title: req.query.title,
        description: req.query.description,
        min_price: req.query.min_price,
        max_price: req.query.max_price,

        writer: req.query.writer,
        writer_name: req.query.writer_name,
        category: req.query.category,
        category_name: req.query.category_name,
        format: req.query.format,
        format_name: req.query.format_name,
        
        key: req.query.key,
        order: req.query.order,
        limit: parseInt(req.query.limit),
        offset: parseInt(req.query.offset)
    };
    req.session["format_name"] = filter.format_name;
    req.session["category_name"] = filter.category_name;
    let posts = await Post.findAll(filter);

    const today = new Date();
    const year = today.getFullYear(); // 2023
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // 06
    const day = today.getDate().toString().padStart(2, '0'); // 18
    const dateString = year + '-' + month + '-' + day; // 2023-06-18
    
    posts.map((val, idx) => {
        if(val.created_at.substring(0, 10) == dateString){
            posts[idx].simpleCreated_at = val.created_at.substring(11, 19);
        } else{
            posts[idx].simpleCreated_at = val.created_at.substring(0, 10);
        }
    });

    decorator.render(req, res, "board", { 
        posts: posts, 
        category_name: filter.category_name, 
        format_name: filter.format_name,
        offset: filter.offset || 0,
        limit: filter.limit || 3,
    });
});


// 게시물 생성
router.post("/", 
    auth.requirePrivate, 
    upload.array("images"),
    controller.validateCreateParameter,
    controller.create);
// 게시물 검색
router.get("/search", controller.findAll);
// 게시물 가져오기
router.get("/:pid", controller.findOne);
// 게시물 정보 수정
router.put("/:pid", 
    auth.extractWriter, 
    auth.requirePrivateOnlyMine, 
    upload.array("images"),
    controller.validateUpdateParameter,
    controller.updateOne);
// 게시물 삭제
router.delete("/:pid", 
    auth.extractWriter, 
    auth.requirePrivateOnlyMine, 
    controller.deleteOne);


// 조회수 증가
router.post("/:pid/up-views", 
    nullSafty.ensurePost,
    controller.upViews);
// 추천수 증가
router.post("/:pid/up-likes", 
    auth.requirePrivate, 
    nullSafty.ensurePost,
    controller.upLikes);
// 다운로드수 증가
router.post("/:pid/up-downloads", 
    auth.requirePrivate, 
    nullSafty.ensurePost,
    controller.upDownloads);

module.exports=router;