var express = require('express');
var router = express.Router();
var User = require('../models/User')

/* GET home page. */
router.get('/', async function (req, res) {
    let bag = { }
    try{
        if(req.session.uid){
            bag.isPrivate = true;
            bag.uid = req.session.uid;
            bag.user_name = (await User.findById(bag.uid)).name;

            res.render('home', bag);
            return;
        }
    } catch(e){
        console.log(e);
    }
    bag.isPrivate = false;
    res.render('home', bag);

    //res.render('index', { title: 'Express' });
});

module.exports = router;
