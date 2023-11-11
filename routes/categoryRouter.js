// Import
const express = require("express");
const Category = require("../models/Category");
const controller = require("../controllers/categoryController");
const auth = require("../middlewares/auth");
// Router
const router = express.Router();


// 카테고리 생성
router.post("/", 
    auth.requireAdmin, 
    controller.validateCreateParameter, 
    controller.create);
// 카테고리 검색
router.get("/search", controller.findAll);
// 카테고리 가져오기
router.get("/:cid", controller.findOne);
// 카테고리 정보 수정
router.put("/:cid", auth.requireAdmin, controller.updateOne);
// 카테고리 삭제
router.delete("/:cid", auth.requireAdmin, controller.deleteOne);

module.exports=router;