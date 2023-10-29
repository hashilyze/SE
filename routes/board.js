// Import
const express = require("express");
const moment = require("moment");
const Post = require("../lib/Post");
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

router.get('/:pageNo',(req, res) => {
    let pageNo = parseInt(req.params.pageNo) || 0;
    let options = {
        key: "pid", 
        order: "DESC", 
        limit: 10, 
        offset: pageNo * 10
    };

    Post.findHeadersByRange(options, (err, headers) => {
        if(err){
            res.status(500).send({message: err.message || "Error occured while find posts"});
            return;
        }
        headers.map((val, idx) => { 
            headers[idx].simple_reg_date = 
                val.reg_date.substr(0, 10) == moment().format("YYYY-MM-DD")
                ? val.reg_date.substr(11, 5)
                : val.reg_date.substr(0, 10);
        })
        res.render("list", {page: pageNo, posts: headers});
    });
});

module.exports=router;