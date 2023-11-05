// Import
const express = require("express");
// Router
const router = express.Router();

router.post("/:uid/:pid", (req, res) => res.send("물품 추가"));
router.delete("/:uid/:pid", (req, res) => res.send("물품 제거"));
router.post("/pay", (req, res) => res.send("즉시 구매"));
router.get("/:uid", (req, res) => res.send("장바구니 가져오기"));


module.exports=router;