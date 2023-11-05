// Import
const express = require("express");
const categoryController = require("../controllers/categoryController");
// Router
const router = express.Router();


// 카테고리 생성
router.post("/", categoryController.create);
// 카테고리 검색
router.get("/search", categoryController.findAll);
// 카테고리 가져오기
router.get("/:cid", categoryController.findOne);
// 카테고리 정보 수정
router.put("/:cid", categoryController.updateOne);
// 카테고리 삭제
router.delete("/:cid", categoryController.deleteOne);

module.exports=router;