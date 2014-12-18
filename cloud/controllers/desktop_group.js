module.exports = function(){
	var express = require('express');
	var app = express();
	var DesktopGroup = Parse.Object.extend('DesktopGroup');
	var Desktop 	 = Parse.Object.extend('Desktop');
	var authentication = require('cloud/tools/require-user.js');

	app.get('/', authentication, getAll);
	app.get('/zone/:zone', authentication, getByZone);

	function getAll(req, res){
		var query = new Parse.Query(DesktopGroup);
		query.include("desktops.user");
		query.include("desktops.phone");
		query.find({
			success: function(results) {
				var desktopGroups = new Array();
				results.forEach(function(itDesktopGroup){
					var desktopGroup = toJSON(itDesktopGroup);
					desktopGroups.push(desktopGroup);
				});
				res.json(desktopGroups);
			},
			error: error
		});
	};

	function getByZone(req, res){
		var zone = req.params.zone;
		var query = new Parse.Query(DesktopGroup);
		query.equalTo('zone', zone);
		query.include("desktops.user");
		query.include("desktops.phone");
		query.find({
			success: function(results) {
				var desktopGroups = new Array();
				results.forEach(function(itDesktopGroup){
					var desktopGroup = toJSON(itDesktopGroup);
					desktopGroups.push(desktopGroup);
				});
				res.json(desktopGroups);
			},
			error: error
		});
	};

	function toJSON(desktopGroup){
		return {
			objectId: desktopGroup.id,
			name: desktopGroup.get('name'),
			desktops: desktopGroup.get('desktops'),
		};
	}

	function error(object, error) {
		console.error(error);
		error.status = 'ko';
		res.json(error);
	}

	return app;
}();