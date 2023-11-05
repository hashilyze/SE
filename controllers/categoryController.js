const Category = require("../models/Category");


// 카테고리 생성
exports.create = async function (req, res) {
    let newCategory = new Category(req.body);

    try {
        let id = await Category.create(newCategory);
        res.status(201).send({ result: "succsss", cid: id });
    } catch (err) {
        res.status(500).send({ result: "fail" });
    }
};


// 카테고리 가져오기
exports.findOne = async function (req, res) {
    let cid = req.params.cid

    try {
        let category = await Category.findById(cid);
        res.send({ result: "success", category });
    } catch (err) {
        if (err.kind == "not_found") res.status(404).send({ result: "fail" });
        else res.status(500).send({ result: "fail" });
    }
};


// 카테고리 수정
exports.updateOne = async function (req, res) {
    let cid = req.params.cid;
    let updateInfo = new Category(req.body);

    try {
        await Category.updateById(cid, updateInfo);
        res.send({ result: "success" });
    } catch (err) {
        if (err.kind == "not_found") res.status(404).send({ result: "fail" });
        else res.status(500).send({ result: "fail" });
    }
};


// 카테고리 삭제
exports.deleteOne = async function (req, res) {
    let cid = req.params.cid;

    try {
        await Category.deleteById(cid);
        res.send({ result: "success" });
    } catch (err) {
        if (err.kind == "not_found") res.status(404).send({ result: "fail" });
        else res.status(500).send({ result: "fail" });
    }
};


// 카테고리 검색
exports.findAll = async function (req, res) {
    try {
        let categories = await Category.findAll({ name: req.query.name || null });
        res.send({ result: "success", categories });
    } catch (err) {
        res.status(500).send({ result: "fail" });
    }
};