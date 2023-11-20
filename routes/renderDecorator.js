var User = require('../models/User');


exports.render = async function(req, res, url, params){
    if(!params) params = { };
    params.format_name = req.session["format_name"];
    params.category_name = req.session["category_name"];

    try{
        if(req.session.uid){
            params.isPrivate = true;
            params.uid = req.session.uid;
            let user = await User.findById(params.uid);
            params.user_name = user.name;
            params.user_role = user.role;

            res.render(url, params);
            return;
        }
    } catch(e){
        console.log(e);
    }
    params.isPrivate = false;
    res.render(url, params);
};