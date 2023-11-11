// Import
const express = require("express");
const controller = require("../controllers/authController");
// Router
const router = express.Router();

// 로그인 페이지
router.get("/sign-in", (req, res) => res.render("sign-in"));
// 회원가입 페이지
router.get("/sign-up", (req, res) => res.render("sign-up"));


// 로그인
router.post("/sign-in", controller.signin);
// 로그아웃
router.post("/sign-out", controller.signout);
// 로그인 상태 조회
router.get("/state", controller.whoOnline);

module.exports=router;