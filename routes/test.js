// Import
const express = require("express");
const path = require("path");
// Router
const router = express.Router();

const common_path = "../views/test/";
router.get("/category", (req, res) => res.sendFile(path.join(__dirname, common_path + "test-category.html")));
router.get("/user", (req, res) => res.sendFile(path.join(__dirname, common_path + "test-user.html")));
router.get("/post", (req, res) => res.sendFile(path.join(__dirname, common_path + "test-post.html")));


module.exports=router;