// Import
const express = require("express");
const Basket = require("../models/Basket");
const controller = require("../controllers/basketController");
const auth = require("../middlewares/auth");
const nullSafty = require("../middlewares/nullSafty");
// Router
const router = express.Router();


// 장바구니 페이지
router.get("/", 
    auth.requirePrivate,
    async (req, res) => res.render("basket", { baskets: await Basket.findAll({ uid: req.session.uid }) }));


// 장바구니에 추가
router.post("/:uid/:pid", 
    auth.requirePrivateOnlyMine, 
    nullSafty.ensureUser,
    nullSafty.ensurePost,
    controller.addOne);
// 장바구니에서 제거
router.delete("/:uid/:pid", 
    auth.requirePrivateOnlyMine, 
    nullSafty.ensureUser,
    nullSafty.ensurePost,
    controller.removeOne);
// 장바구니 가져오기
router.get("/:uid", 
    auth.requirePrivateOnlyMine, 
    nullSafty.ensureUser,
    controller.findAll);

module.exports=router;