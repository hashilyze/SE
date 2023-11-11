// Import
const express = require("express");
const User = require("../models/User");
const controller = require("../controllers/userController");
const auth = require("../middlewares/auth");
// Router
const router = express.Router();


// 사용자 생성
router.post("/", 
    controller.validateCreateParameter,
    controller.create);
// 사용자 검색
router.get("/search", auth.requireAdmin, controller.findAll);
// 사용자 가져오기
router.get("/:uid", auth.requirePrivateOnlyMine, controller.findOne);
// 사용자 정보 수정
router.put("/:uid", auth.requirePrivateOnlyMine, controller.updateOne);
// 사용자 삭제
router.delete("/:uid", auth.requirePrivateOnlyMine, controller.deleteOne);

module.exports=router;