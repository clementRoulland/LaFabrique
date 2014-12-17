module.exports = function(){
	var express = require('express');
	var app = express();
	var DesktopGroup = Parse.Object.extend('DesktopGroup');
	var Desktop 	 = Parse.Object.extend('Desktop');
	var authentication = require('cloud/tools/require-user.js');

	app.get('/', authentication, getAll);
	app.get('/generateAllDesktops', authentication, generateAllDesktops);
	app.get('/clearAllDesktops', authentication, clearAllDesktops);

	function getAll(res, res){
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

	function generateAllDesktops(res, req){
		var desktopGroups = require('cloud/tools/desktops');
		var query = new Parse.Query(DesktopGroup);

		console.log(desktopGroups);
		desktopGroups.forEach(function(desktopGroupJSON){
			var parseDesktopGroup = new DesktopGroup();
			parseDesktopGroup.set('name', desktopGroupJSON.name);
			parseDesktopGroup.set('zone', desktopGroupJSON.zone);
			var desktops = new Array();

			desktopGroupJSON.desktops.forEach(function(desktopJSON){
				var parseDesktop = new Desktop();
				parseDesktop.set('name', desktopJSON.name);
				desktops.push(parseDesktop);
			});

			parseDesktopGroup.set('desktops', desktops);
			parseDesktopGroup.save();
		});

	}

	function clearAllDesktops(res, req){

		var query = new Parse.Query(DesktopGroup);
		query.include("desktops.user");
		query.include("desktops.phone");
		query.find({
			success: function(results) {
				results.forEach(function(itDesktopGroup){
					itDesktopGroup.get('desktops').forEach(function(itDesktop){
						var parseDesktop = new Desktop();
						itDesktop.destroy();
					});
					itDesktopGroup.destroy();
				});
			},
			error: error
		});

	}

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