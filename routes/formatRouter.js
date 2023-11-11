// Import
const express = require("express");
const Format = require("../models/Format");
const controller = require("../controllers/formatController");
const auth = require("../middlewares/auth");
// Router
const router = express.Router();


// 형식 생성
router.post("/", 
    auth.requireAdmin, 
    controller.validateCreateParameter,
    controller.create);
// 형식 검색
router.get("/search", controller.findAll);
// 형식 가져오기
router.get("/:fid", controller.findOne);
// 형식 정보 수정
router.put("/:fid", auth.requireAdmin, controller.updateOne);
// 형식 삭제
router.delete("/:fid", auth.requireAdmin, controller.deleteOne);

module.exports=router;