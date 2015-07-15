var express = require('express');

module.exports = function() {
    var app = express();

    //response configuration
    app.set('json spaces',4);
    app.use(function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.set("Content-Type", "application/json");
        next();
    });

    // Get routes
    require('./routesConfig')(app);

    app.use(express.static('../public'));

    //return instance
    return app;
};
