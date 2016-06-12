'use strict';

module.exports = function (app, db) {
	app.route('/')
		.get(function (req, res){
      res.render('index.html');
    });
	app.route('/direct_to')
		.get( function(req, res) {
			console.log("now is directing to");
			res.render('index.html');
	});
};