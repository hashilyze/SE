// Import
const express = require("express");
const userController = require("../controllers/userController");
// Router
const router = express.Router();


// 사용자 생성
router.post("/", userController.create);
// 사용자 검색
router.get("/search", userController.findAll);
// 사용자 가져오기
router.get("/:uid", userController.findOne);
// 사용자 정보 수정
router.put("/:uid", userController.updateOne);
// 사용자 삭제
router.delete("/:uid", userController.deleteOne);

module.exports=router;