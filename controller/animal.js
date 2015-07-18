// Load the module dependencies
var mongoose = require('mongoose'),
    userM = mongoose.model('User'),
    url = require('url'),
    userCon = require('./user'),
    fs = require('fs'),
    formidable = require('formidable'),
    cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: 'dmsnaesos',
    api_key: '721548917261634',
    api_secret: 'P8jfvTFY92Wq_-PYOY7E3mspbv8'
});


/*
 function for New animal
 */

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
                userM.findOne({'email':authenticateUser.email}, function(err, doc2) {
                    authenticateUser = doc2;
                    console.log("doc: " + authenticateUser);
                    callback(err,authenticateUser);
                });
            });
        }
    });
}


function FilesArrayIsEmpty(files){
    if (files !== undefined) {
        console.log("Im returning 1");
        return 1;
    }
    console.log("Im returning 0");
    return 0;
}

exports.uploadAnimalImg = function(req,res){
        console.log("In upload img route\n");
        console.log("req files:"+req.files);
        var dataForm = {};
        var form = new formidable.IncomingForm();
        var ImageSend = false;
        var defaultUrl = "http://s11.postimg.org/ypkjkrdz7/album.png"; // default pic
        var app = req.app;
        console.log("this is app: "+app);
    console.log("this is req: "+req);
        form.parse(req, function(error, fields, files) {
            console.log('-->PARSE<--');
            dataForm = fields;  //save the fields information
            console.log("this is files:"+files);
            if (FilesArrayIsEmpty(files)){
                console.log("in IF FilesArrayIsEmpty");
                ImageSend = true;
            }
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
            else {
                console.log("return some defult url image");
        //                res.json(urlImg);
        //            });
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
    console.log("new animal reported: \nAnimal name: "+animalName+"\nanimal age: "+animalAge+"\nanimal pic: "+animalPic+"\n");
    // Create and push the alarm to db here!!
   setAnimal(animalName,animalAge,animalWeight,animalPic, function(err,data) {
        if (err)
            res.send(500, "something went wrong: "+err);
        else {
            // we return the updated user
            res.status(200);
            res.json(data);
        }
    });
};



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
                userM.findOne({'email':authenticateUser.email}, function(err, doc2) {
                    authenticateUser = doc2;
                    console.log("doc: " + authenticateUser);
                    callback(err,authenticateUser);
                });
            });
        }
    });
}


exports.setAnimalField = function(req,res){
    console.log("animal controller - setAnimalField()");
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    var field = query.field;
    var animalId = query.animalId;
    var animalNewVal = query.animalNewVal;

    console.log("update animal "+field+" to: "+animalNewVal+"\n");
    // update animal field to db here!!
    setField(field,animalId,animalNewVal, function(err,data) {
        if (err)
            res.send(500, "something went wrong: "+err);
        else {
            // we return the updated user
            res.status(200)
            res.json(data);
        }
    });
};

/*
 function for delete animal
 */

function deleteAnimalDB(animalId,callback) {
    var authenticateUser = userCon.getAuthenticateUser();  
    console.log("animal id: "+animalId);

    var deleteQuery = userM.findOneAndUpdate(
            { "_id" : authenticateUser._id},
            { $pull: {"animals": { _id : animalId }},
              $pull: {"notifications": {animalId : animalId}}
        });

    deleteQuery.exec(function(err, results) {
        console.log("updated values: "+results);
        // update the 'authenticateUser' from mongo
        userM.findOne({'email':authenticateUser.email}, function(err, doc) {
            authenticateUser = doc;
            console.log("doc: " + authenticateUser);
            callback(err,authenticateUser);
        });
    });
}

exports.deleteAnimal = function(req,res){
    console.log("delete animal");
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    var animalId = query.animalId;
    // delete animal from db
    deleteAnimalDB(animalId, function(err,data) {
        if (err)
            res.send(500, "something went wrong: "+err);
        else {
            // we return the updated user
            res.status(200).json(data);
        }
    });
};

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
    addNewRec(pushQuery, function(err,data) {
        if (err)
            res.send(500, "something went wrong: "+err);
        else {
            // we return the updated user
            res.status(200).json(data);
        }
    });
};

/* add new vaccination */

function createVaccObj(recName,recReceivedDate,recExpDate) {
    return {
        vaccName: recName,
        vaccDate: recReceivedDate,
        vaccExp: recExpDate 
    };
}

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
    addNewRec(pushQuery, function(err,data) {
        if (err)
            res.send(500, "something went wrong: "+err);
        else {
            // we return the updated user
            res.status(200).json(data);
        }
    });
};

/* add new care */

function createCareObj(careType,careDate,careExp) {
    return {
        careType: careType,
        careDate: careDate,
        careExp: careExp 
    };
}

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
    // execute the query
    addNewRec(pushQuery, function(err,data) {
        if (err)
            res.send(500, "something went wrong: "+err);
        else {
            // we return the updated user
            res.status(200).json(data);
        }
    });
};

/* add new record : vaccination/care/food/servise */
function addNewRec(pushQuery,callback) {
    var authenticateUser = userCon.getAuthenticateUser();
    var query = pushQuery;
    query.exec(function(err, results) {
        console.log("Number of updated values: "+results);
        // update the 'authenticateUser' from mongo
        userM.findOne({'email':authenticateUser.email}, function(err, doc2) {
            authenticateUser = doc2;
            console.log("doc: " + authenticateUser);
            callback(err,authenticateUser);
        });
    });
}



/* callback instead of the few rows written several times..
    I didnt try it yet, we need to decide what we are going to do with all the errors 
*/

/*
function templateCallback(err,data) {
    if (err)
        res.send(500, "something went wrong: "+err);
    else {
        // we return the updated user
        res.status(200).json(data);
    }
}
*/

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
        userM.findOne({'email':authenticateUser.email}, function(err, doc) {
            authenticateUser = doc;
            //console.log("doc: " + authenticateUser);
            callback(err,authenticateUser);
        });
    });
}

exports.deleteItemComplexDetail = function(req,res){
    console.log("animal controller - deleteItemComplexDetail()");
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;

    var animalId = query.animalId;
    var typeComplexDetail = query.typeComplexDetail;
    var itemId = query.itemId;
    deleteItemComplexDetailFromDB(animalId,typeComplexDetail,itemId, function(err,data) {
        if (err)
            res.send(500, "something went wrong: "+err);
        else {
            // we return the updated user
            res.status(200);
            res.json(data);
        }
    });
};