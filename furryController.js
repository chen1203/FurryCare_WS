//var mongoose = require('mongoose');
//var db = mongoose.connect('mongodb://tomchen:tom@ds031792.mongolab.com:31792/furrycare');
//
//var userSchema = require('./model/user_schema').userSchema;
//var userM = mongoose.model('userM', userSchema);
//var authenticateUser;

//mongoose.connection.once('open',function(){
///*
//	var query = userM.findOne({'email':'tomcohent@gmail.com'});
//	query.exec(function(err,doc){
//		authenticateUser = doc;
//		console.log("doc: " + authenticateUser);
//	});*/
//});

//exports.getUser = function(userMail, callback) {
//	console.log("on getUser");
//	var query = userM.findOne({'email':userMail});
//	query.exec(function(err,doc) {
//		if (err)
//			console.log("error on set animal :\n "+err);
//		else {
//			authenticateUser = doc;
//			console.log("doc: " + authenticateUser);
//			callback(err,authenticateUser);
//		}
//	});
//};

//exports.setAlarm = function(alarmType,alarmName,alarmExpDate, callback) {
//	console.log("on setAlarm");
//	var query = userM.findOne({'email':authenticateUser.email});
//	query.exec(function(err,doc) {
//		if (err)
//			console.log(err);
//		else {
//			var alarm = {
//				alarmName: ''+alarmName,
//				alarmType: ''+alarmType,
//				alarmDate: new Date(alarmExpDate)
//			};
//			console.log("new alarm : "+alarm);
//			var query = doc.update({$push:{alarms:alarm}});
//			query.exec(function(err, results) {
//				console.log("Number of updated values: "+results);
//				// update the 'authenticateUser' from mongo
//				userM.findOne({'email':authenticateUser.email}, function(err, doc2) {
//					authenticateUser = doc2;
//					console.log("doc: " + authenticateUser);
//					callback(err,authenticateUser);
//				});
//			});
//		}
//	});
//};

//exports.setAnimal = function(animalName,animalAge,animalWeight,animalPic, callback) {
//	console.log("on setAnimal");
//	var query = userM.findOne({'email':authenticateUser.email});
//	query.exec(function(err,doc) {
//		if (err)
//			console.log("error on set animal :\n "+err);
//		else {
//			var animal = {
//				animalName: ''+animalName,
//            	animalAge: animalAge,
//            	animalWeight: animalWeight,
//            	animalPic: ''+animalPic
//			};
//			var query = doc.update({$push:{animals:animal}});
//			query.exec(function(err, results) {
//				console.log("Number of updated values: "+results);
//				// update the 'authenticateUser' from mongo
//				userM.findOne({'email':authenticateUser.email}, function(err, doc2) {
//					authenticateUser = doc2;
//					console.log("doc: " + authenticateUser);
//					callback(err,authenticateUser);
//				});
//			});
//		}
//	});
//};

//exports.setAnimalField = function(field,animalId,animalNewVal,callback) {
//	console.log("on setAnimal: "+field);
//	var query = userM.findOne({'email':authenticateUser.email});
//	query.exec(function(err,doc) {
//		if (err)
//			console.log("error on set animal :\n "+err);
//		else {
//			console.log("user id : "+doc._id);
//			console.log("animal id: "+animalId);
//			console.log("animal new value: "+animalNewVal);
//			if (field === "animalName")
//				var updateQuery = userM.findOneAndUpdate(
//					{ "_id" : doc._id, "animals._id" : animalId},
//					{ "$set" : {"animals.$.animalName" : animalNewVal }
//					});
//			else if (field === "animalAge")
//				var updateQuery = userM.findOneAndUpdate(
//					{ "_id" : doc._id, "animals._id" : animalId},
//					{ "$set" : {"animals.$.animalAge" : animalNewVal }
//					});
//			else
//				var updateQuery = userM.findOneAndUpdate(
//					{ "_id" : doc._id, "animals._id" : animalId},
//					{ "$set" : {"animals.$.animalWeight" : animalNewVal }
//					});
//
//			updateQuery.exec(function(err, results) {
//				console.log("updated values: "+results);
//				// update the 'authenticateUser' from mongo
//				userM.findOne({'email':authenticateUser.email}, function(err, doc2) {
//					authenticateUser = doc2;
//					console.log("doc: " + authenticateUser);
//					callback(err,authenticateUser);
//				});
//			});
//		}
//	});
//};

//exports.deleteAnimal = function(animalId,callback) {
//
//	var query = userM.findOne({'email':authenticateUser.email});
//	query.exec(function(err,doc) {
//		if (err)
//			console.log("error on set animal :\n "+err);
//		else {
//			console.log("user id : "+doc._id);
//			console.log("animal id: "+animalId);
//
//			var deleteQuery = userM.findOneAndUpdate(
//				{ "_id" : doc._id},
//				{$pull: {"animals": { _id : animalId }}});
//
//			deleteQuery.exec(function(err, results) {
//				console.log("updated values: "+results);
//				// update the 'authenticateUser' from mongo
//				userM.findOne({'email':authenticateUser.email}, function(err, doc2) {
//					authenticateUser = doc2;
//					console.log("doc: " + authenticateUser);
//					callback(err,authenticateUser);
//				});
//			});
//		}
//	});
//};