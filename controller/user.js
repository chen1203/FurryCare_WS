// Load the module dependencies
var mongoose = require('mongoose'),
    userM = mongoose.model('User'),
    url = require('url');
// hold the user
var authenticateUser;

function authenticate(userMail, callback) {
    console.log("on getUser");
    var query = userM.findOne({'email':userMail});
    query.exec(function(err,doc) {
        if (err)
            console.log("error on set animal :\n "+err);
        else {
            authenticateUser = doc;
            console.log("doc: " + authenticateUser);
            callback(err,authenticateUser);
        }
    });
}
exports.getAuthenticateUser = function(){
    return authenticateUser;
};
exports.getUser = function(req,res){
    console.log("user controller - getUser()");
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    var userMail = query.userMail;
    console.log("user mail: "+userMail+"\n");
    authenticate(userMail, function(err,data) {
        console.log("error on getUser from server... " + err);
        if (err)
            res.send(500, "something went wrong: "+err);
        else {
            console.log("error is null.");
            // we return the required user
            res.status(200);
            res.json(data);
        }
    });
};



