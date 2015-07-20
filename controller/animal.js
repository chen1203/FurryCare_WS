// load the module dependencies
var mongoose = require('mongoose'),
    userM = mongoose.model('User'),
    url = require('url'),
    userCon = require('./user'),
    notificationCon = require('./notification'),
    fs = require('fs'),
    formidable = require('formidable'),
    cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: 'dmsnaesos',
    api_key: '721548917261634',
    api_secret: 'P8jfvTFY92Wq_-PYOY7E3mspbv8'
});

/**** animals functions in ws ****/

function setAnimal(animalName,animalAge,animalWeight,animalPic, callback) {
    var authenticateUser = userCon.getAuthenticateUser();
    console.log("on setAnimal");
    var query = userM.findOne({'email':authenticateUser.email});
    query.exec(function(err,doc) {
        if (err)
            console.log("error on set animal :\n "+err);
        else {
            var animal = {
                animalName: ''+animalName,
                animalAge: animalAge,
                animalWeight: animalWeight,
                animalPic: ''+animalPic
            };
            var query = doc.update({$push:{animals:animal}});
            query.exec(function(err, results) {
                console.log("Number of updated values: "+results);
                // update the 'authenticateUser' from mongo
                userM.findOne({'email':authenticateUser.email}, userCon.updateUserCallback(err, doc, callback));
            });
        }
    });
}
function filesArrayIsEmpty(files){
    if (files !== undefined) {
        console.log("Im returning 1");
        return 1;
    }
    console.log("Im returning 0");
    return 0;
}
/*
 function for set animal fields
  */
function setField(field,animalId,animalNewVal,callback) {
    var authenticateUser = userCon.getAuthenticateUser();
    var updateQuery = null;
    console.log("on setAnimal: "+field);
    var query = userM.findOne({'email':authenticateUser.email});
    query.exec(function(err,doc) {
        if (err)
            console.log("error on set animal :\n "+err);
        else {
            console.log("user id : "+doc._id);
            console.log("animal id: "+animalId);
            console.log("animal new value: "+animalNewVal);
            if (field === "animalName")
                updateQuery = userM.findOneAndUpdate(
                    { "_id" : doc._id, "animals._id" : animalId},
                    { "$set" : {"animals.$.animalName" : animalNewVal }
                    });
            else if (field === "animalAge")
                updateQuery = userM.findOneAndUpdate(
                    { "_id" : doc._id, "animals._id" : animalId},
                    { "$set" : {"animals.$.animalAge" : animalNewVal }
                    });
            else
                updateQuery = userM.findOneAndUpdate(
                    { "_id" : doc._id, "animals._id" : animalId},
                    { "$set" : {"animals.$.animalWeight" : animalNewVal }
                    });

            updateQuery.exec(function(err, results) {
                console.log("updated values: "+results);
                // update the 'authenticateUser' from mongo
                userM.findOne({'email':authenticateUser.email}, userCon.updateUserCallback(err, doc, callback));
            });
        }
    });
}
/*
 function for delete animal
 */
function deleteAnimalDB(animalId,callback) {
    var authenticateUser = userCon.getAuthenticateUser();  
    console.log("animal id: "+animalId);

    var deleteQuery = userM.findOneAndUpdate(
            { "_id" : authenticateUser._id},
            { $pull: {"animals": { _id : animalId }}}
        );

    deleteQuery.exec(function(err, results) {
        console.log("updated values: "+results);
        // update the 'authenticateUser' from mongo
        userM.findOne({'email':authenticateUser.email}, userCon.updateUserCallback(err, doc, callback));
    });
}
function deleteAnimalNotifications(animalId,callback) {
    var authenticateUser = userCon.getAuthenticateUser();  
    console.log("animal id: "+animalId);
    var deleteQuery = userM.findOneAndUpdate(
            { "_id" : authenticateUser._id},
            { $pull: {"notifications": {animalId : animalId}}}
        );

    deleteQuery.exec(function(err, results) {
        console.log("updated values: "+results);
        // update the 'authenticateUser' from mongo
        userM.findOne({'email':authenticateUser.email}, userCon.updateUserCallback(err, doc, callback));
    });
}
/* add new food */
function createFoodObj(foodName,foodBrand,foodBagWeight,foodBagPrice,foodDailyUsage,foodDate) {
    return {
        foodName: foodName,
        foodBrand: foodBrand,
        foodBagWeight: foodBagWeight,
        foodBagPrice: foodBagPrice,
        foodDailyUsage : foodDailyUsage,
        foodDate : foodDate
    };
}
/* add new care */
function createCareObj(careType,careDate,careExp) {
    return {
        careType: careType,
        careDate: careDate,
        careExp: careExp 
    };
}
/* add new record : vaccination/care/food/servise */
function addNewRec(pushQuery,callback) {
    var authenticateUser = userCon.getAuthenticateUser();
    var query = pushQuery;
    query.exec(function(err, results) {
        console.log("Number of updated values: "+results);
        // update the 'authenticateUser' from mongo
        userM.findOne({'email':authenticateUser.email}, userCon.updateUserCallback(err, doc, callback));
    });
}
function deleteItemComplexDetailFromDB(animalId,typeComplexDetail,itemId, callback) {
    var authenticateUser = userCon.getAuthenticateUser();
    var deleteItemQuery;   
    if (typeComplexDetail == "vacc") 
        deleteItemQuery = userM.findOneAndUpdate(
            { "_id" : authenticateUser._id, "animals._id" : animalId},
            { $pull : {"animals.$.animalVaccination": { _id : itemId}  }}
        );
    else if (typeComplexDetail == "food")
        deleteItemQuery = userM.findOneAndUpdate(
            { "_id" : authenticateUser._id, "animals._id" : animalId},
            { $pull : {"animals.$.animalFood": { _id : itemId}  }}
        );
    else if (typeComplexDetail == "care") 
    // not just else to ensure that the type is correct
        deleteItemQuery = userM.findOneAndUpdate(
            { "_id" : authenticateUser._id, "animals._id" : animalId},
            { $pull : {"animals.$.animalCare": { _id : itemId}  }}
        );

    deleteItemQuery.exec(function(err, results) {
        console.log("Number of updated values: "+results);
        // update the 'authenticateUser' from mongo
        userM.findOne({'email':authenticateUser.email}, userCon.updateUserCallback(err, doc, callback));
    });
}
/* add new vaccination */
function createVaccObj(recName,recReceivedDate,recExpDate) {
    return {
        vaccName: recName,
        vaccDate: recReceivedDate,
        vaccExp: recExpDate 
    };
}

/**** animal functions exported in ws ****/

exports.uploadAnimalImg = function(req,res){
        console.log("req files:"+req.files);
        var dataForm = {};
        var form = new formidable.IncomingForm();
        var ImageSend = false;
        var app = req.app;
        form.parse(req, function(error, fields, files) {
            dataForm = fields;  //save the fields information
            console.log("this is files:"+files);
            if (filesArrayIsEmpty(files))
                ImageSend = true;
        });
        form.on('error', function(err) {
            console.log("in form on error " + err);
        });
        form.on('end', function(error, fields, files) {
           console.log("form on event");
            if (ImageSend) {
                console.log("image send is true");
                var temp_path = this.openedFiles[0].path;
                console.log("req files:"+form.path);
                console.log("req files:"+req.files);
                console.log("this is temp path:" + temp_path);
                var stream = cloudinary.uploader.upload_stream(function(response) {
                    console.log("in result from cloudinary");
                    var urlImg=response.url;
                    console.log("this is the image url:"+urlImg);
                    res.json(urlImg);
                });
               var file_reader = fs.createReadStream(temp_path).pipe(stream);
           }
        });

};
exports.setNewAnimal = function(req,res){
    console.log("animal controlle - setNewAnimal()");
    var url_parts = url.parse(req.url, true);
    var query1 = url_parts.query;
    // same variables for all alarms
    var animalName = query1.animalName;
    var animalAge = query1.animalAge;
    var animalWeight = query1.animalWeight;
    var animalPic = query1.animalPic;
    setAnimal(animalName,animalAge,animalWeight,animalPic, userCon.templateResponseCallback(err, doc));
};
exports.setAnimalField = function(req,res){
    console.log("animal controller - setAnimalField()");
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    var field = query.field;
    var animalId = query.animalId;
    var animalNewVal = query.animalNewVal;
    // update animal field to db here!!
    setField(field,animalId,animalNewVal, userCon.templateResponseCallback(err, doc));
};
exports.deleteAnimal = function(req,res){
    console.log("delete animal");
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    var animalId = query.animalId;
    // delete animal from db
    deleteAnimalDB(animalId, function(err,data) {
        if (err)
            res.status(500).json({"error": err});
        else 
            deleteAnimalNotifications(animalId, userCon.templateResponseCallback(err, doc));
    });
};
exports.addNewFood = function(req,res){
    var authenticateUser = userCon.getAuthenticateUser();
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    // parsing variables from url query
    var animalId = query.currAnimalId;
    var foodName = query.foodName;
    var foodBrand = query.foodBrand;
    var foodBagWeight = query.foodBagWeight;
    var foodBagPrice = query.foodBagPrice;
    var foodDailyUsage = query.foodDailyUsage;
    var foodDate = query.foodDate;
    // create food obj to add to db
    var foodObj = createFoodObj(foodName,foodBrand,foodBagWeight,foodBagPrice,foodDailyUsage,foodDate);
    // create a query to push this vaccination obj
    var pushQuery = userM.findOneAndUpdate(
                        { "_id" : authenticateUser._id, "animals._id" : animalId},
                        { "$push" : {"animals.$.animalFood":foodObj}}
                    );
    // execute the query
    addNewRec(pushQuery, userCon.templateResponseCallback(err, data));
};
exports.addNewVacc = function(req,res){
    var authenticateUser = userCon.getAuthenticateUser();
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    // parsing variables from url query
    var animalId = query.currAnimalId;
    var vaccName = query.vaccName;
    var vaccDate = query.vaccDate;
    var vaccExp = query.vaccExp;
    // create vaccination obj to add to db
    var vaccObj = createVaccObj(vaccName,vaccDate,vaccExp);
    // create a query to push this vaccination obj
    var pushQuery = userM.findOneAndUpdate(
                        { "_id" : authenticateUser._id, "animals._id" : animalId},
                        { "$push" : {"animals.$.animalVaccination":vaccObj}}
                    );
    // execute the query
    addNewRec(pushQuery, userCon.templateResponseCallback(err, data));
};
exports.addNewCare = function(req,res){
    var authenticateUser = userCon.getAuthenticateUser();
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    // parsing variables from url query
    var animalId = query.currAnimalId;
    var careType = query.careType;
    var careDate = query.careDate;
    var careExp = query.careExp;
    // create care obj to add to db
    var careObj = createCareObj(careType,careDate,careExp);
    // create a query to push this vaccination obj
    var pushQuery = userM.findOneAndUpdate(
                        { "_id" : authenticateUser._id, "animals._id" : animalId},
                        { "$push" : {"animals.$.animalCare":careObj}}
                    );
    addNewRec(pushQuery, userCon.templateResponseCallback(err, data));
};
exports.deleteItemComplexDetail = function(req,res){
    console.log("animal controller - deleteItemComplexDetail()");
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;

    var animalId = query.animalId;
    var typeComplexDetail = query.typeComplexDetail;
    var itemId = query.itemId;
    deleteItemComplexDetailFromDB(animalId,typeComplexDetail,itemId, function(err,data) {
        if (err)
            res.status(500).json({"error": err});
        else  //  delete this item notification if exist
            notificationCon.deleteNotiByConnectedDetailId(itemId, userCon.templateResponseCallback(err, data));
    });
};