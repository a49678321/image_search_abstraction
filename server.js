'use strict'
var express = require('express');
var mongo = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var url = require('url');
var path = require('path');
var routes = require('./app/routes/index.js');
var handle = require('./app/common/handle.js');
var dotenv = require('dotenv').config({
  silent: true
});

var app = express();
app.use(express.static(__dirname + '/public'));
mongo.connect(process.env.MONGOLAB_URI,function(err, db){
	db.createCollection("search_history", {
    	capped: true,
    	size:8000
	});
	if(err) throw err;	
	routes(app,db);
	//handle(app,db);
});



var port = process.env.PORT || 8080;
	app.listen(port, function() {
    	console.log('Node.js listening on port ' + port);
});