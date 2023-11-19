var User = require('../models/User');


exports.render = async function(req, res, url, params){
    if(!params) params = { };

    try{
        if(req.session.uid){
            params.isPrivate = true;
            params.uid = req.session.uid;
            params.user_name = (await User.findById(params.uid)).name;

            res.render(url, params);
            return;
        }
    } catch(e){
        console.log(e);
    }
    params.isPrivate = false;
    res.render(url, params);
};