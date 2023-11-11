const Category = require("../models/Category");
const utility = require("./utility");


exports.validateCreateParameter = async (req, res, next) =>{
    if(req.body.name === undefined){
        console.log("There is not name parameter");
        utility.errorHandle({kind: "bad_request"}, req, res);
        return;
    }
    if(await Category.existByName(req.body.name)){
        console.log("Duplicated as same name");
        utility.errorHandle({kind: "bad_request"}, req, res)
    } else{
        next();
    }
};

// 카테고리 생성
exports.create = async function (req, res) {
    let newCategory = new Category(req.body);
    
    try {
        let id = await Category.create(newCategory);
        res.status(201).send({ ...utility.getSuccess(), cid: id });
    } catch (err) {
        utility.errorHandle(err, req, res);
    }
};


// 카테고리 가져오기
exports.findOne = async function (req, res) {
    let cid = req.params.cid;

    try {
        let category = await Category.findById(cid);
        res.send({ ...utility.getSuccess(), category });
    } catch (err) {
        utility.errorHandle(err, req, res);
    }
};


// 카테고리 수정
exports.updateOne = async function (req, res) {
    let cid = req.params.cid;
    let updateInfo = new Category(req.body);

    try {
        await Category.updateById(cid, updateInfo);
        res.send(utility.getSuccess());
    } catch (err) {
        utility.errorHandle(err, req, res);
    }
};


// 카테고리 삭제
exports.deleteOne = async function (req, res) {
    let cid = req.params.cid;
    
    try {
        await Category.deleteById(cid);
        res.send(utility.getSuccess());
    } catch (err) {
        utility.errorHandle(err, req, res);
    }
};


// 카테고리 검색
exports.findAll = async function (req, res) {
    try {
        let categories = await Category.findAll({ name: req.query.name || null });
        res.send({ ...utility.getSuccess(), categories });
    } catch (err) {
        utility.errorHandle(err, req, res);
    }
};