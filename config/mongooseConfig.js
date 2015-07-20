// get mongoose
var mongoose = require('mongoose');
// moongose configuration
module.exports = function() {
	// connect to mongo 
    var db = mongoose.connect('mongodb://tomchen:tom@ds031792.mongolab.com:31792/furrycare');
    // application model
    require('../model/user_schema');
    //return instance
    return db;
};