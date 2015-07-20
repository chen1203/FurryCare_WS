// load the module dependencies
var mongoose = require('mongoose'),
    userM = mongoose.model('User'),
    url = require('url'),
    notificationCon = require('./notification');

// hold the user
var authenticateUser;

/**** template callback functions for all controlers ****/

/* template callback response function */
exportes.templateResponseCallback = function(err,data) {
    if (err)
        res.status(500).json({"error": err});
    else 
        res.status(200).json(data);
};
/* template callback update user */
exports.updateUserCallback = function(err, doc, callback) {
    if (err)
        console.log("error :\n "+err);
    else {
        authenticateUser = doc;
        console.log("doc: " + authenticateUser);
        callback(err,authenticateUser);
    }
};

/**** user functions in ws ****/

function authenticate(userMail, callback) {
    console.log("on getUser");
    var query = userM.findOne({'email':userMail});
    query.exec(updateUserCallback(err,doc,callback));
}

/**** user functions exported in ws ****/

/* get user saved here, not from mongo */
exports.getAuthenticateUser = function(){
    return authenticateUser;
};
/* get user from mongo with user mail */
exports.getUser = function(req,res){
    console.log("user controller - getUser()");
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    var userMail = query.userMail;
    console.log("user mail: "+userMail+"\n");
    authenticate(userMail, function(err,data) {
        if (err)
            res.send(500, "something went wrong: "+err);
        else {
            console.log("error is null.");
            // delete noties....
            notificationCon.deleteNotiPassed(function(err,data) {
                if (err)
                    res.send(500, "something went wrong: "+err);
                else {
                    console.log("error is null.");
                    // we return the required user
                    res.status(200).json(data);
                }
            });
        }
    });
};



