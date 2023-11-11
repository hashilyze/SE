const Basket = require("../models/Basket");
const Download = require("../models/Download");
const Post = require("../models/Post");
const utility = require("./utility");


// 장바구니 내 저작물 구매
exports.payOnBasket = async (req, res) => {
    let uid = req.session.uid;
    
    try{
        let baskets = await Basket.findAll({uid});
        for(let basket of baskets){
            let list = await Download.findAll({uid: basket.uid, pid: basket.pid});
            if(list.length == 0) await Post.addDownloadsById(pid, 1);
            await Download.create({uid: basket.uid, pid: basket.pid});
            await Basket.deleteById({uid: basket.uid, pid: basket.pid});
        }
        res.send(utility.getSuccess());
    } catch(err){
        utility.errorHandle(err, req, res);
    }
};

// 선택한 저작물 구매
exports.onePay = async (req, res) => {
    let uid = req.session.uid;
    let pid = req.params.pid;

    try{
        let list = await Download.findAll({uid, pid});
        if(list.length == 0) await Post.addDownloadsById(pid, 1);
        await Download.create({uid, pid});
        res.send(utility.getSuccess());
    } catch(err){
        utility.errorHandle(err, req, res);
    }
};