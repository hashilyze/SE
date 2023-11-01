// Import
const express = require("express");
const User = require("../models/User");
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

router.post("/user", (req, res) => {
    let newUser = new User(req.body);

    User.create(newUser, (err, user) => {
        if(err) res.status(500).send();
        res.status(201).send({result: "succsss", uid: user.uid });
    });
});
router.get("/user/:uid", (req, res) => {
    User.findById(req.params.uid, (err, user) => {
        if(err){
            if(err.kind == "not_found") res.status(404).send();
            else if(err.kind == "server_error") res.status(500).send();
        } else{
            res.send({ result: "success", user });
        }
    });
});
router.put("/user/:uid", (req, res) => {
    res.send("사용자 갱신");
});
router.delete("/user/:uid", (req, res) => {
    res.send("사용자 삭제");
});
router.get("/users", (req, res) => {
    res.send("사용자 검색");
});

module.exports=router;