var express = require('express');
var router = express.Router();
var decorator = require("./renderDecorator");

/* GET home page. */
router.get('/', async function (req, res) {
    await decorator.render(req, res, "home");
});

module.exports = router;
