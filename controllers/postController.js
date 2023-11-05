const Post = require("../models/Post");


// 게시물 생성
exports.create = async function (req, res) {
    let newPost = new Post(req.body);

    try {
        let id = await Post.create(newPost);
        res.status(201).send({ result: "succsss", pid: id });
    } catch (err) {
        res.status(500).send({ result: "fail" });
    }
};


// 게시물 가져오기
exports.findOne = async function (req, res) {
    let pid = req.params.pid

    try{
        let post = await Post.findById(pid);
        res.send({ result: "success", post });
    }catch(err){
        if(err.kind == "not_found") res.status(404).send({ result: "fail" });
        else res.status(500).send({ result: "fail" });
    }
};


// 게시물 수정
exports.updateOne = async function (req, res){
    let pid = req.params.pid;
    let updateInfo = new Post(req.body);

    try {
        await Post.updateById(pid, updateInfo);
        res.send({ result: "success" });
    } catch (err) {
        if (err.kind == "not_found") res.status(404).send({ result: "fail" });
        else res.status(500).send({ result: "fail" });
    }
};


// 게시물 삭제
exports.deleteOne = async function (req, res) {
    let pid = req.params.pid;

    try {
        await Category.deleteById(pid);
        res.send({ result: "success" });
    } catch (err) {
        if (err.kind == "not_found") res.status(404).send({ result: "fail" });
        else res.status(500).send({ result: "fail" });
    }
}


// 게시물 검색
exports.findAll = async function (req, res) {
    try {
        let posts = await Post.findAll({ name: req.query.name || null });
        res.send({ result: "success", posts });
    } catch (err) {
        res.status(500).send({ result: "fail" });
    }
};