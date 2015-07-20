// get the configuration mongoose and express
 var mongoose = require('./config/mongooseConfig'),
	 express = require('./config/expressConfig');

 var db = mongoose();
 var app = express();

var port = process.env.PORT || 3000;
app.listen(port);
console.log("listening on port "+port);
