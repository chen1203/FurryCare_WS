
// Get mongoose
var mongoose = require('mongoose');


// Moongose configuration
module.exports = function() {

    var db = mongoose.connect('mongodb://tomchen:tom@ds031792.mongolab.com:31792/furrycare');
    // application models
    require('../model/user_schema');
    //return instance
    return db;
};