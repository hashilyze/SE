// Import
const express = require("express");
// Router
const router = express.Router();


router.get("/sign-in", (req, res) => res.send("로그인 페이지"));
router.get("/sign-up", (req, res) => res.send("회원가입 페이지"));


router.post("/sign-in", (req, res) => res.send("로그인 후, 응답"));
router.post("/sign-out", (req, res) => res.send("로그아웃 후, 응답"));

module.exports=router;