const User = require("../models/User");
const utility = require("./utility");


exports.validateCreateParameter = async (req, res, next) =>{
    if(req.body.login_id === undefined || req.body.login_id === ""){
        console.log("Login_id is not exist");
    } else if(req.body.password === undefined || req.body.password === ""){
        console.log("Password is not exist");
    } else if(req.body.name === undefined || req.body.name === ""){
        console.log("Name is not exist");
    } else if(await User.existByLoginId(req.body.login_id)){
        console.log("Duplicated login_id");
        utility.errorHandle({kind: "forbidden"}, req, res);
        return;
    }  else{
        next();
        return;
    }
    utility.errorHandle({kind: "bad_request"}, req, res);
};

// 사용자 생성
exports.create = async function (req, res) {
    let newUser = new User(req.body);
    if(newUser.login_id === undefined
    || newUser.password === undefined
    || newUser.name === undefined){
        utility.errorHandle({kind: "bad_request"}, req, res);
        return;
    }
    
    try {
        let id = await User.create(newUser);
        res.status(201).send({ ...utility.getSuccess(), uid: id });
    } catch (err) {
        utility.errorHandle(err, req, res);
    }
};


// 사용자 가져오기
exports.findOne = async function (req, res) {
    let uid = req.params.uid;

    try {
        let user = await User.findById(uid);
        res.send({ ...utility.getSuccess(), user });
    } catch (err) {
        utility.errorHandle(err, req, res);
    }
};


// 사용자 수정
exports.updateOne = async function (req, res) {
    let uid = req.params.uid;
    let updateInfo = new User(req.body);

    try {
        await User.updateById(uid, updateInfo);
        res.send(utility.getSuccess());
    } catch (err) {
        utility.errorHandle(err, req, res);
    }
};


// 사용자 삭제
exports.deleteOne = async function (req, res) {
    let uid = req.params.uid;

    try {
        await User.deleteById(uid);
        res.send(utility.getSuccess());
    } catch (err) {
        utility.errorHandle(err, req, res);
    }
}


// 사용자 검색
exports.findAll = async function (req, res) {
    try {
        let users = await User.findAll({ name: req.query.name || null });
        res.send({ ...utility.getSuccess(), users });
    } catch (err) {
        utility.errorHandle(err, req, res);
    }
};