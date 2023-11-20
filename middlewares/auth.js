const utility = require("../controllers/utility")
const Post = require("../models/Post")


exports.isPublic = (session) => true;
exports.isPrivate = (session) => Boolean(session.uid);
exports.isAdmin = (session) => exports.isPrivate(session) && Boolean(session.role);
exports.isPrivateOnlyMine = (session, uid) => exports.isAdmin(session) || exports.isPrivate(session) && uid == session.uid;

exports.extractWriter = async function(req, res, next){
    try{
        let { writer } = await Post.findById(req.params.pid);
        req.params.uid = writer;
        next();
    } catch(err){
        utility.errorHandle({ kind: "not_found"}, req, res);
    }
    
}

// 비회원 이상
exports.requirePublic = function(req, res, next){
    console.log("Access public domain");
    next();
};

// 회원 이상
exports.requirePrivate = function(req, res, next){
    if(exports.isPrivate(req.session)){
        console.log("Access private domain");
        next();
    } else{
        console.log("Deny private domain");
        res.status(401).send(utility.getFail());
    }
};

// 회원 이상 (일반회원은 자신과 관련된 정보만 접근 가능)
exports.requirePrivateOnlyMine = function(req, res, next){
    if(exports.isPrivateOnlyMine(req.session, req.params.uid)){
        console.log("Access private my domain");
        next();
    } else{
        console.log("Deny private my domain");
        res.status(401).send(utility.getFail());
    }
};

// 관리자 이상
exports.requireAdmin = function(req, res, next){
    if(exports.isAdmin(req.session)){
        console.log("Access admin domain");
        next();
    } else{
        console.log("Deny admin domain");
        res.status(401).send(utility.getFail());
    }
};

// 비회원 이상
exports.requirePublicForPage = function(req, res, next){
    console.log("Access public domain");
    next();
};

// 회원 이상
exports.requirePrivateForPage = function(req, res, next){
    if(exports.isPrivate(req.session)){
        console.log("Access private domain");
        next();
    } else{
        console.log("Deny private domain");
        res.redirect("/");
    }
};

// 회원 이상 (일반회원은 자신과 관련된 정보만 접근 가능)
exports.requirePrivateOnlyMineForPage = function(req, res, next){
    if(exports.isPrivateOnlyMine(req.session, req.params.uid)){
        console.log("Access private my domain");
        next();
    } else{
        console.log("Deny private my domain");
        res.redirect("/");
    }
};

// 관리자 이상
exports.requireAdminForPage = function(req, res, next){
    if(exports.isAdmin(req.session)){
        console.log("Access admin domain");
        next();
    } else{
        console.log("Deny admin domain");
        res.redirect("/");
    }
};