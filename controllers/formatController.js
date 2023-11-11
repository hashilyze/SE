const Format = require("../models/Format");
const utility = require("./utility");


exports.validateCreateParameter = async (req, res, next) =>{
    if(req.body.name === undefined){
        console.log("There is not name parameter");
        utility.errorHandle({kind: "bad_request"}, req, res);
        return;
    }
    if(await Format.existByName(req.body.name)){
        console.log("Duplicated as same name");
        utility.errorHandle({kind: "bad_request"}, req, res);
    } else{
        next();
    }
};

// 형식 생성
exports.create = async function (req, res) {
    let newFormat = new Format(req.body);
    
    try {
        let id = await Format.create(newFormat);
        res.status(201).send({ ...utility.getSuccess(), fid: id });
    } catch (err) {
        utility.errorHandle(err, req, res);
    }
};


// 형식 가져오기
exports.findOne = async function (req, res) {
    let fid = req.params.fid;

    try {
        let format = await Format.findById(fid);
        res.send({ ...utility.getSuccess(), format });
    } catch (err) {
        utility.errorHandle(err, req, res);
    }
};


// 형식 수정
exports.updateOne = async function (req, res) {
    let fid = req.params.fid;
    let updateInfo = new Format(req.body);

    try {
        await Format.updateById(fid, updateInfo);
        res.send(utility.getSuccess());
    } catch (err) {
        utility.errorHandle(err, req, res);
    }
};


// 형식 삭제
exports.deleteOne = async function (req, res) {
    let fid = req.params.fid;

    try {
        await Format.deleteById(fid);
        res.send(utility.getSuccess());
    } catch (err) {
        utility.errorHandle(err, req, res);
    }
};


// 형식 검색
exports.findAll = async function (req, res) {
    try {
        let formats = await Format.findAll({ name: req.query.name || null });
        res.send({ ...utility.getSuccess(), formats });
    } catch (err) {
        utility.errorHandle(err, req, res);
    }
};