// Import
const express = require("express");
const path = require("path");
// Router
const router = express.Router();

// fetch
router.get("/fetch", (req, res) => res.sendFile(path.join(__dirname, "../views/test/fetch.html")));


module.exports=router;