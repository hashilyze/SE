// Import
const express = require("express");
const Category = require("../models/Category");
const categoryController = require("../controllers/categoryController");
// Router
const router = express.Router();


// 카테고리 생성
router.post("/category", categoryController.create);
// 카테고리 가져오기
router.get("/category/:cid", categoryController.findOne);
// 카테고리 정보 수정
router.put("/category/:cid", categoryController.updateOne);
// 카테고리 삭제
router.delete("/category/:cid", categoryController.deleteOne);
// 카테고리 검색
router.get("/categories", categoryController.findAll);

module.exports=router;