// Import
const express = require("express");
const moment = require("moment");
const Post = require("../models/Post");
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

router.get('/:page', async(req, res) => {
    let page = parseInt(req.params.page) || 0;
    let filter = {
        key: "pid", 
        order: "DESC", 
        limit: 10, 
        offset: page * 10
    };

    try{
        let posts = await Post.findAll(filter);
        posts.map((val, idx) => { 
            posts[idx].simple_created_at = 
                val.created_at.substr(0, 10) == moment().format("YYYY-MM-DD")
                ? val.created_at.substr(11, 5)
                : val.created_at.substr(0, 10);
        });
        res.render("list", {page, posts});
    }catch(err){
        res.status(500).send("Error occured while find posts");
    }
});

module.exports=router;