const Category = require("../models/Category");
const util = require("./util");


// 카테고리 생성
exports.create = async function (req, res) {
    let newCategory = new Category(req.body);
    
    try {
        let id = await Category.create(newCategory);
        res.status(201).send({ ...util.getSuccess(), cid: id });
    } catch (err) {
        util.errorHandle(err, req, res);
    }
};


// 카테고리 가져오기
exports.findOne = async function (req, res) {
    let cid = req.params.cid

    try {
        let category = await Category.findById(cid);
        res.send({ ...util.getSuccess(), category });
    } catch (err) {
        util.errorHandle(err, req, res);
    }
};


// 카테고리 수정
exports.updateOne = async function (req, res) {
    let cid = req.params.cid;
    let updateInfo = new Category(req.body);

    try {
        await Category.updateById(cid, updateInfo);
        res.send(util.getSuccess());
    } catch (err) {
        util.errorHandle(err, req, res);
    }
};


// 카테고리 삭제
exports.deleteOne = async function (req, res) {
    let cid = req.params.cid;

    try {
        await Category.deleteById(cid);
        res.send(util.getSuccess());
    } catch (err) {
        util.errorHandle(err, req, res);
    }
};


// 카테고리 검색
exports.findAll = async function (req, res) {
    try {
        let categories = await Category.findAll({ name: req.query.name || null });
        res.send({ ...util.getSuccess(), categories });
    } catch (err) {
        util.errorHandle(err, req, res);
    }
};