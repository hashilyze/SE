const Post = require("../models/Post");


// 게시물 생성
exports.create = function (req, res) {
    let newPost = new Post(req.body);
    Post.create(newPost, (err, post) => {
        if(err) res.status(500).send({ result: "fail" });
        res.status(201).send({result: "succsss", pid: post.pid });
    });
};


// 게시물 가져오기
exports.findOne = function (req, res) {
    let pid = req.params.pid
    Post.findById(pid, (err, post) => {
        if(err){
            if(err.kind == "not_found") res.status(404).send({ result: "fail" });
            else if(err.kind == "server_error") res.status(500).send({ result: "fail" });
        } else{
            res.send({ result: "success", post });
        }
    });
};


// 게시물 수정
exports.updateOne = function (req, res){
    let pid = req.params.pid;
    let updateInfo = new Post(req.body);
    Post.updateById(pid, updateInfo, (err) => {
        if(err){
            if(err.kind == "not_found") res.status(400).send({ result: "fail" });
            else if(err.kind == "server_error") res.status(500).send({ result: "fail" });
        } else{
            res.send({ result: "success"});
        }
    });
};


// 게시물 삭제
exports.deleteOne = function (req, res) {
    let pid = req.params.pid;
    Post.deleteById(pid, (err) => {
        if(err){
            if(err.kind == "not_found") res.status(400).send({ result: "fail" });
            else if(err.kind == "server_error") res.status(500).send({ result: "fail" });
        } else{
            res.send({ result: "success"});
        }
    });
}


// 게시물 검색
exports.findAll = function (req, res) {
    Post.findAll((err, posts) => {
        if(err) res.status(500).send({result: "fail"});
        else res.send({result:"success", posts});
    });
};