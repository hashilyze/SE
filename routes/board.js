// Import
const express = require("express");
const db_handler = require("../lib/db_api");
// Router
const postRouter = require("./post");

const router = express.Router();
router.parent_url = "/";
router.root_url = "/board";
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
    db_handler.getPosts(req.params.page * limit, limit, (data) => {
        res.render("list", {
            page: Number(req.params.page),
            posts: data,
        });
    });
});

module.exports=router;