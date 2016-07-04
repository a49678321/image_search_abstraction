'use strict';
var Search = require('node-bing-api');
var request = require('request');
module.exports = function (app, db) {
	var collection = db.collection('search_history');
	app.get('/',function(req,res){
		res.render('index.html');
	});
	
	app.get('/history',function(req,res){
		collection.find({}).sort({'time_search': -1}).limit(10).toArray( function (err, docs) {
            if(err) throw err;
            
            docs.forEach( function (element, index, array) {
               res.write( 'Date: ' + element.time_search + '\nSearch: ' + element.str_search + '\n' ); 
            });
			res.end();
		});
	});
	

	app.get('/search/:str',function(req, res) {
		var str = req.params.str;
		var offset = req.query.offset || 0;
		var search = new Search({ accKey: process.env.Bing_Search_API });
		str = str.replace(/%20/g, ' ');
		collection.insert({'str_search': req.params.str, 'time_search': new Date()});
		search.images(str, {top: 5, skip: offset*5}, function(err, respond, body){
			if(err) throw err;
			res.end(body.d.results.map(makeList));
			});
	});
	function makeList(img) {
	// Construct object from the json result
		return {
		  "url": img.MediaUrl,
		  "snippet": img.Title,
		  "thumbnail": img.Thumbnail.MediaUrl,
		  "context": img.SourceUrl
		};
	}
	
}