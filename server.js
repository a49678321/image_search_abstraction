'use strict'
var express = require('express');
var mongo = require('mongodb').MongoClient;
var path = require('path');
var routes = require('./app/routes/index.js');
var handle = require('./app/common/handle.js');
var dotenv = require('dotenv').config({
  silent: true
});

var app = express();

mongo.connect(process.env.MONGOLAB_URI,function(err, db){
	if(err) throw err;
	else console.log("we have successfully connect to the port 27017");
	app.use(express.static(__dirname + '/public'));
	//app.set('views', path.join(__dirname, 'views'));
	//app.set('view engine', 'jade');
	//routes(app,db);
	db.createCollection("pickup", {
    	capped: true,
    	size: 5242880,
    	max: 5000
	});
	routes(app,db);
	handle(app,db);
	var port = process.env.PORT || 8080;
	app.listen(port, function() {
    	console.log('Node.js listening on port ' + port);
	});
});