const Basket = require("../models/Basket");
const utility = require("./utility");


// 저작물 추가
exports.addOne = async function (req, res) {
    let uid = req.params.uid;
    let pid = req.params.pid;

    try {
        await Basket.create({ uid, pid });
        res.status(201).send({ ...utility.getSuccess() });
    } catch (err) {
        utility.errorHandle(err, req, res);
    }
};


// 장바구니 가져오기
exports.findOne = async function (req, res) {
    let uid = req.params.uid;
    let pid = req.params.pid;

    try {
        let basket = await Basket.findById({ uid, pid });
        res.send({ ...utility.getSuccess(), basket });
    } catch (err) {
        utility.errorHandle(err, req, res);
    }
};


// 저작물 제거
exports.removeOne = async function (req, res) {
    let uid = req.params.uid;
    let pid = req.params.pid;

    try {
        await Basket.deleteById({ uid, pid });
        res.send(utility.getSuccess());
    } catch (err) {
        utility.errorHandle(err, req, res);
    }
};


// 장바구니 목록 가져오기
exports.findAll = async function (req, res) {
    let uid = req.params.uid; uid = parseInt(uid) || undefined;
    let pid = req.params.pid; pid = parseInt(pid) || undefined;
    try {
        let baskets = await Basket.findAll({ uid, pid });
        res.send({ ...utility.getSuccess(), baskets });
    } catch (err) {
        utility.errorHandle(err, req, res);
    }
};