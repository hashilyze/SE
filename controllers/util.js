exports.getSuccess = function() { return { result: "success" } } ;
exports.getFail = function() { return { result: "fail" } } ;

exports.errorHandle = function (err, req, res) {
    if (err.kind == "not_found") res.status(404);
    else if(err.kind == "server_error") res.status(500);
    else{
        console.log(err);
        res.status(500);
    }
    res.send(exports.getFail());        
}