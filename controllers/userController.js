const User = require("../models/User");


// 사용자 생성
exports.create = function (req, res) {
    let newUser = new User(req.body);
    User.create(newUser, (err, user) => {
        if(err) res.status(500).send({ result: "fail" });
        res.status(201).send({result: "succsss", uid: user.uid });
    });
};


// 사용자 가져오기
exports.findOne = function (req, res) {
    let uid = req.params.uid
    User.findById(uid, (err, user) => {
        if(err){
            if(err.kind == "not_found") res.status(404).send({ result: "fail" });
            else if(err.kind == "server_error") res.status(500).send({ result: "fail" });
        } else{
            res.send({ result: "success", user });
        }
    });
};


// 사용자 수정
exports.updateOne = function (req, res){
    let uid = req.params.uid;
    let updateInfo = new User(req.body);
    User.updateById(uid, updateInfo, (err) => {
        if(err){
            if(err.kind == "not_found") res.status(400).send({ result: "fail" });
            else if(err.kind == "server_error") res.status(500).send({ result: "fail" });
        } else{
            res.send({ result: "success"});
        }
    });
};


// 사용자 삭제
exports.deleteOne = function (req, res) {
    let uid = req.params.uid;
    User.deleteById(uid, (err) => {
        if(err){
            if(err.kind == "not_found") res.status(400).send({ result: "fail" });
            else if(err.kind == "server_error") res.status(500).send({ result: "fail" });
        } else{
            res.send({ result: "success"});
        }
    });
}


// 사용자 검색
exports.findAll = function (req, res) {
    User.findAll((err, users) => {
        if(err) res.status(500).send({result: "fail"});
        else res.send({result:"success", users});
    });
};