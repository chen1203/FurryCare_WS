// Load the module dependencies
var mongoose = require('mongoose'),
    userM = mongoose.model('User'),
    url = require('url'),
    userCon = require('./user');

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
        userM.findOne({'email':authenticateUser.email}, function(err, doc) {
            authenticateUser = doc;
            console.log("doc: " + authenticateUser);
            callback(err,authenticateUser);
        });
    });
}

exports.addNewNotification = function(req,res){
    console.log("notification controller - addNewNotification()");
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;

    var animalId = query.animalId;
    var objId = query.objId;
    var notiType = query.notiType;
    var notiName = query.notiName;
    var notiReceivedDate = query.notiReceivedDate;
    var notiExpiredDate = query.notiExpiredDate;
    //console.log("new alarm reported: \nAlarm Type: "+query.alarmtype+"\nAlarm Name: "+query.alarmname+"\nExp. Date: "+query.expdate);
    // Create and push the alarm to db here!!
    addNotiFromDB(animalId,objId,notiType,notiName,notiReceivedDate,notiExpiredDate, function(err,data) {
        if (err)
            res.send(500, "something went wrong: "+err);
        else {
            // we return the updated user
            res.status(200);
            res.json(data);
        }
    });
};


function deleteNotiFromDB(notiId, callback) {
    var authenticateUser = userCon.getAuthenticateUser();
    var deleteNotiQuery = userM.findOneAndUpdate(
                        { "_id" : authenticateUser._id},
                        { $pull : {"notifications": { _id : notiId}  }}
                    );
    deleteNotiQuery.exec(function(err, results) {
        console.log("Number of updated values: "+results);
        // update the 'authenticateUser' from mongo
        userM.findOne({'email':authenticateUser.email}, function(err, doc) {
            authenticateUser = doc;
            console.log("doc: " + authenticateUser);
            callback(err,authenticateUser);
        });
    });
}

exports.deleteNotificationByNotiId = function(req,res){
    console.log("notification controller - deleteNotification()");
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;

    var notiId = query.notiId;
    deleteNotiFromDB(notiId, function(err,data) {
        if (err)
            res.send(500, "something went wrong: "+err);
        else {
            // we return the updated user
            res.status(200);
            res.json(data);
        }
    });
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

    deleteNotiQuery.exec(function(err, results) {
        console.log("Number of updated values: "+results);
        // update the 'authenticateUser' from mongo
        userM.findOne({'email':authenticateUser.email}, function(err, doc) {
            authenticateUser = doc;
            console.log("doc: " + authenticateUser);
            callback(err,authenticateUser);
        });
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
        userM.findOne({'email':authenticateUser.email}, function(err, doc) {
            authenticateUser = doc;
            console.log("doc: " + authenticateUser);
            callback(err,authenticateUser);
        });
    });
};