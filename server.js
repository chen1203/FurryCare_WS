
// get the configuration mongoose and express
 var mongoose = require('./config/mongooseConfig'),
	 express = require('./config/expressConfig');

 var db = mongoose();
 var app = express();

 // Use the Express application instance to listen to the port
 //app.listen(process.env.PORT || 3000);

 console.log('server is listening');
 app.listen(3000);
 console.log("listening on port 3000 \n\n");


//var express = require('express');
//var app = express();
//var url = require('url');
//var authenticateUser = require('./furryController');
//
//app.use('/', express.static('./public'));

//app.get('/getUser',function(req,res){
//	console.log("get user web service");
//	var url_parts = url.parse(req.url, true);
//	var query = url_parts.query;
//	var userMail = query.userMail;
//	console.log("user mail: "+userMail+"\n");
//	authenticateUser.getUser(userMail, function(err,data) {
//		console.log("error on getUser from server... " + err);
//		if (err)
//			 res.send(500, "something went wrong: "+err);
//		else {
//			console.log("error is null.");
//			// we return the required user
//			res.header("Access-Control-Allow-Origin", "*");
//			res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//			app.set('json spaces',4);
//			res.set("Content-Type", "application/json");
//			res.status(200)
//			res.json(data);
//		}
//	});
//});

//app.get('/setNewAlarm',function(req,res){
//	console.log("set new alarm");
//	var url_parts = url.parse(req.url, true);
//	var query = url_parts.query;
//	// same variables for all alarms
//	var alarmType= query.alarmtype;
//	var alarmName= query.alarmname;
//	var alarmExpDate= query.expdate;
//	console.log("new alarm reported: \nAlarm Type: "+query.alarmtype+"\nAlarm Name: "+query.alarmname+"\nExp. Date: "+query.expdate);
//	// Create and push the alarm to db here!!
//	authenticateUser.setAlarm(alarmType,alarmName,alarmExpDate, function(err,data) {
//		if (err)
//			res.send(500, "something went wrong: "+err);
//		else {
//			// we return the updated user
//			res.header("Access-Control-Allow-Origin", "*");
//			res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//			app.set('json spaces',4);
//			res.set("Content-Type", "application/json");
//			res.status(200);
//			res.json(data);
//		}
//	});
//});

//app.get('/setNewAnimal',function(req,res){
//	console.log("set new animal");
//	var url_parts = url.parse(req.url, true);
//	var query1 = url_parts.query;
//	// same variables for all alarms
//	var animalName = query1.animalName;
//	var animalAge = query1.animalAge;
//	var animalWeight = query1.animalWeight;
//	var animalPic = query1.animalPic;
//	console.log("new animal reported: \nAnimal name: "+animalName+"\nanimal age: "+animalAge+"\nanimal pic: "+animalPic+"\n");
//	// Create and push the alarm to db here!!
//	authenticateUser.setAnimal(animalName,animalAge,animalWeight,animalPic, function(err,data) {
//		if (err)
//			 res.send(500, "something went wrong: "+err);
//		else {
//			// we return the updated user
//			res.header("Access-Control-Allow-Origin", "*");
//			res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//			app.set('json spaces',4);
//			res.set("Content-Type", "application/json");
//			res.status(200)
//			res.json(data);
//		}
//	});
//});

//app.get('/setAnimalField',function(req,res){
//	console.log("set animal field");
//	var url_parts = url.parse(req.url, true);
//	var query = url_parts.query;
//	var field = query.field;
//	var animalId = query.animalId;
//	var animalNewVal = query.animalNewVal;
//
//	console.log("update animal "+field+" to: "+animalNewVal+"\n");
//	// update animal field to db here!!
//	authenticateUser.setAnimalField(field,animalId,animalNewVal, function(err,data) {
//		if (err)
//			 res.send(500, "something went wrong: "+err);
//		else {
//			// we return the updated user
//			res.header("Access-Control-Allow-Origin", "*");
//			res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//			app.set('json spaces',4);
//			res.set("Content-Type", "application/json");
//			res.status(200)
//			res.json(data);
//		}
//	});
//});

//app.get('/deleteAnimal',function(req,res){
//	console.log("delete animal");
//	var url_parts = url.parse(req.url, true);
//	var query = url_parts.query;
//	var animalId = query.animalId;
//	// delete animal from db
//	authenticateUser.deleteAnimal(animalId, function(err,data) {
//		if (err)
//			 res.send(500, "something went wrong: "+err);
//		else {
//			// we return the updated user
//			res.header("Access-Control-Allow-Origin", "*");
//			res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//			app.set('json spaces',4);
//			res.set("Content-Type", "application/json");
//			res.status(200)
//			res.json(data);
//		}
//	});
//});

//var port = process.env.PORT || 3000;
//var port = 3000;
//app.listen(port);
//console.log("listening on port "+port+"...\n\n");
