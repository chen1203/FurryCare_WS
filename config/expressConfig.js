var express = require('express');

module.exports = function() {
    var app = express();

    // response configuration
    app.set('json spaces',4);
    app.use(function(req, res, next) {
        /*res.header('Access-Control-Allow-Origin', 'http://shenkar.html5-book.co.il');*/
        /*res.header('Access-Control-Allow-Origin', 'http://localhost:8080');*/
        res.header('Access-Control-Allow-Origin',"*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        /*res.header('Access-Control-Allow-Credentials', 'true');*/
        res.set("Content-Type", "application/json");
        next();
    });

    // get routes
    require('./routesConfig')(app);
    app.use(express.static('../public'));
    // return instance
    return app;
};


