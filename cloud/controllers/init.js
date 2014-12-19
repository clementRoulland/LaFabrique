module.exports = function(){
	var express = require('express');
	var app = express();
	var DesktopGroup = Parse.Object.extend('DesktopGroup');
	var Desktop 	 = Parse.Object.extend('Desktop');
	var Room 	 	 = Parse.Object.extend('Room');
	var User 	 	 = Parse.User;
	var authentication = require('cloud/tools/require-user.js');

	app.get('/load', load);
	app.get('/clear', clear);

	function load(req, res){
		loadUsers();
		loadRooms();
		loadDesktops();
	}

	function clear(req, res){
		clearDesktops();
		clearDesktopGroups();
		clearRooms();
		clearUsers();
	}

	function loadDesktops(){
		console.log('loadDesktops');
		var desktopGroups = require('cloud/tools/desktops');
		console.log(desktopGroups);
		desktopGroups.forEach(function(desktopGroupJSON){
			var parseDesktopGroup = new DesktopGroup();
			parseDesktopGroup.set('name', desktopGroupJSON.name);
			parseDesktopGroup.set('zone', desktopGroupJSON.zone);
			var desktops = new Array();

			desktopGroupJSON.desktops.forEach(function(desktopJSON){
				var parseDesktop = new Desktop();
				parseDesktop.set('name', desktopJSON.name);
				if(desktopJSON.phone){
					parseDesktop.set('phone', {
						'number': '' + desktopJSON.phone.shortNumber,
						'shortNumber': desktopJSON.phone.shortNumber,
					});
				}
				desktops.push(parseDesktop);
			});

			parseDesktopGroup.set('desktops', desktops);
			parseDesktopGroup.save();
		});
	}

	function loadRooms(){
		console.log('loadRooms');
		var rooms = require('cloud/tools/rooms');
		console.log(rooms);
		rooms.forEach(function(roomJSON){
			var roomParse = new Room();
			roomParse.set('name', roomJSON.name);
			roomParse.set('idGoogle', roomJSON.idGoogle);
			roomParse.set('idHtml', roomJSON.idHtml);
			roomParse.set('zone', roomJSON.zone);
			roomParse.save();
		});
	}

	function loadUsers(){
		console.log('loadUsers');
		var users = require('cloud/tools/users');
		console.log(users);
		users.forEach(function(userJSON){
			var userParse = new User();

			userParse.setUsername(userJSON.email.split("@")[0]);
			userParse.setPassword(userJSON.email.split("@")[0]);
			userParse.setEmail(userJSON.email);

			userParse.set('firstname', userJSON.firstName);
			userParse.set('lastname', userJSON.lastName);
			userParse.set('fullname', userJSON.firstName + " " + userJSON.lastName);

			userParse.save();
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

	function clearUsers(){
		var query = new Parse.Query(User);
		query.find({
			success: function(results) {
				results.forEach(function(itUser){
					if(itUser.getUsername() != 'admin'){
						itUser.destroy();
					}
				});
			},
			error: error
		});
	}

	function error(object, error) {
		console.error(error);
		error.status = 'ko';
		res.json(error);
	}

	return app;
}();