module.exports = function(){
	var express = require('express');
	var app = express();
	var DesktopGroup = Parse.Object.extend('DesktopGroup');
	var Desktop 	 = Parse.Object.extend('Desktop');
	var Room 	 	 = Parse.Object.extend('Room');
	var authentication = require('cloud/tools/require-user.js');

	app.get('/load', authentication, load);
	app.get('/clear', authentication, clear);

	function load(req, res){
		loadDesktops();
		loadRooms();
	}

	function clear(req, res){
		clearDesktops();
		clearDesktopGroups();
		clearRooms();
	}

	function loadDesktops(){
		var desktopGroups = require('cloud/tools/desktops');
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

	function loadRooms(){
		var desktopGroups = require('cloud/tools/rooms');
		desktopGroups.forEach(function(roomJSON){
			var roomParse = new Room();
			roomParse.set('name', roomJSON.name);
			roomParse.set('idGoogle', roomJSON.idGoogle);
			roomParse.set('idHtml', roomJSON.idHtml);
			roomParse.save();
		});
	}

	function clearDesktopGroups(){
		var query = new Parse.Query(DesktopGroup);
		query.find({
			success: function(results) {
				results.forEach(function(itDesktopGroup){
					itDesktopGroup.destroy();
				});
			},
			error: error
		});
	}
	function clearDesktops(){
		var query = new Parse.Query(Desktop);
		query.find({
			success: function(results) {
				results.forEach(function(itDesktop){
					itDesktop.destroy();
				});
			},
			error: error
		});
	}
	function clearRooms(){
		var query = new Parse.Query(Room);
		query.find({
			success: function(results) {
				results.forEach(function(itRoom){
					itRoom.destroy();
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