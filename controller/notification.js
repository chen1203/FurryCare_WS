// load the module dependencies
var mongoose = require('mongoose'),
    userM = mongoose.model('User'),
    url = require('url'),
    userCon = require('./user');

/**** notifications functions in ws ****/

/* add new notification to user in mongo */
function addNotiFromDB(animalId,objId,notiType,notiName,notiReceivedDate,notiExpiredDate, callback) {
    var authenticateUser = userCon.getAuthenticateUser();
    console.log("on set Noti");
    var noti = {
            animalId : animalId,
            detailConnectedId : objId,
            notiType: notiType,
            notiName: notiName, 
            notiReceivedDate: notiReceivedDate,
            notiExpiredDate: notiExpiredDate
        };
    var addNotiQuery = userM.findOneAndUpdate(
                        { "_id" : authenticateUser._id},
                        { $push : {notifications:noti}}
                    );
    addNotiQuery.exec(function(err, results) {
        console.log("Number of updated values: "+results);
        // update the 'authenticateUser' from mongo
        userM.findOne({'email':authenticateUser.email}, userCon.updateUserCallback(err, doc, callback));
    });
}
/* delete notification from user by notification id in mongo */
function deleteNotiFromDB(notiId, callback) {
    var authenticateUser = userCon.getAuthenticateUser();
    var deleteNotiQuery = userM.findOneAndUpdate(
                        { "_id" : authenticateUser._id},
                        { $pull : {"notifications": { _id : notiId}  }}
                    );
    deleteNotiQuery.exec(function(err, results) {
        console.log("Number of updated values: "+results);
        // update the 'authenticateUser' from mongo
        userM.findOne({'email':authenticateUser.email}, userCon.updateUserCallback(err, doc, callback));
    });
}

/**** notifications functions exported in ws ****/

/* add new notification to user */
exports.addNewNotification = function(req,res){
    console.log("Notification controller - addNewNotification()");
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    var animalId = query.animalId;
    var objId = query.objId;
    var notiType = query.notiType;
    var notiName = query.notiName;
    var notiReceivedDate = query.notiReceivedDate;
    var notiExpiredDate = query.notiExpiredDate;
    addNotiFromDB(animalId,objId,notiType,notiName,notiReceivedDate,notiExpiredDate, userCon.templateResponseCallback(err,data));
};
exports.deleteNotificationByNotiId = function(req,res){
    console.log("Notification controller - deleteNotificationByNotiId()");
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    var notiId = query.notiId;
    deleteNotiFromDB(notiId, userCon.templateResponseCallback(err,data));
};
exports.deleteNotiPassed = function(callback) {
    var authenticateUser = userCon.getAuthenticateUser();
    var currentDate = new Date();
    var deleteNotiQuery = userM.findOneAndUpdate(
                { "_id" : authenticateUser._id},
                { $pull : {"notifications": 
                        { notiReceivedDate : {$lt : currentDate},
                          notiExpiredDate : {$lt : currentDate}
                        }  
                }});
    deleteNotiQuery.exec( function(err, results) {
        console.log("Number of updated values: "+results);
        // update the 'authenticateUser' from mongo
        userM.findOne({'email':authenticateUser.email}, userCon.updateUserCallback(err, doc, callback));
    });
};
exports.deleteNotiByConnectedDetailId = function(detailConnectedId, callback) {
    var authenticateUser = userCon.getAuthenticateUser();
    var deleteNotiQuery = userM.findOneAndUpdate(
                { "_id" : authenticateUser._id},
                { $pull : {"notifications": {detailConnectedId : detailConnectedId}}
        });
    deleteNotiQuery.exec(function(err, results) {
        console.log("Number of updated values: "+results);
        // update the 'authenticateUser' from mongo
        userM.findOne({'email':authenticateUser.email}, userCon.updateUserCallback(err, doc, callback));
    });
};

