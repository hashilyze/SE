exports.getSuccess = function() { return { result: "Success" } } ;
exports.getFail = function() { return { result: "Fail" } } ;

exports.errorHandle = function (err, req, res) {
    if (err.kind == "bad_request") res.status(400);
    else if (err.kind == "forbidden") res.status(403);
    else if (err.kind == "not_found") res.status(404);
    else if(err.kind == "server_error") res.status(500);
    else{
        console.log(err);
        res.status(500);
    }
    res.send(exports.getFail());        
}