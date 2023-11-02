const Category = require("../models/Category");

controller = Object();


// 카테고리 생성
controller.create = function (req, res) {
    let newCategory = new Category(req.body);
    Category.create(newCategory, (err, category) => {
        if(err) res.status(500).send({ result: "fail" });
        res.status(201).send({result: "succsss", cid: category.cid });
    });
};


// 카테고리 가져오기
controller.findOne = function(req, res) {
    let cid = req.params.cid
    Category.findById(cid, (err, category) => {
        if(err){
            if(err.kind == "not_found") res.status(404).send({ result: "fail" });
            else if(err.kind == "server_error") res.status(500).send({ result: "fail" });
        } else{
            res.send({ result: "success", category });
        }
    });
};


// 카테고리 수정
controller.updateOne = function(req, res){
    let cid = req.params.cid;
    let updateInfo = new Category(req.body);
    Category.updateById(cid, updateInfo, (err) => {
        if(err){
            if(err.kind == "not_found") res.status(400).send({ result: "fail" });
            else if(err.kind == "server_error") res.status(500).send({ result: "fail" });
        } else{
            res.send({ result: "success"});
        }
    });
};


// 카테고리 삭제
controller.deleteOne = function(req, res) {
    let cid = req.params.cid;
    Category.deleteById(cid, (err) => {
        if(err){
            if(err.kind == "not_found") res.status(400).send({ result: "fail" });
            else if(err.kind == "server_error") res.status(500).send({ result: "fail" });
        } else{
            res.send({ result: "success"});
        }
    });
}


// 카테고리 검색
controller.findAll = function(req, res) {
    Category.findAll((err, categories) => {
        if(err) res.status(500).send({result: "fail"});
        else res.send({result:"success", categories});
    });
};

module.exports=controller;