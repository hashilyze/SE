// Import
const express = require("express");
const User = require("../models/User");
const userController = require("../controllers/userController");
// Router
const router = express.Router();


router.get("/sign-in", (req, res) => { 
    res.send("로그인 페이지");
});
router.get("/sign-up", (req, res) => { 
    res.send("회원가입 페이지");
});


router.post("/sign-in", (req, res) => {
    res.send("로그인 후, 응답 신호 반환");
});
router.post("/sign-out", (req, res) => {
    res.send("로그아웃 후, 응답 신호 반환");
});


// 사용자 생성
router.post("/user", userController.create);
// 사용자 가져오기
router.get("/user/:uid", userController.findOne);
// 사용자 정보 수정
router.put("/user/:uid", userController.updateOne);
// 사용자 삭제
router.delete("/user/:uid", userController.deleteOne);
// 사용자 검색
router.get("/users", userController.findAll);

module.exports=router;