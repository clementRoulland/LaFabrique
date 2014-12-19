module.exports = function(){

	var express = require('express');
	var app = express();
	var DesktopGroup = Parse.Object.extend('DesktopGroup');
	var Desktop 	 = Parse.Object.extend('Desktop');
	var User 		 = Parse.User;
	var authentication = require('cloud/tools/require-user.js');

	app.get('/', authentication, getAll);
	app.get('/zone/:zone', authentication, getByZone);
	app.get('/:id/user/:userId', authentication, setDeskUser);

	function getAll(req, res){
		var query = new Parse.Query(DesktopGroup);
		query.include("desktops.user");
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
	}

	function getByZone(req, res){
		var zone = req.params.zone;
		var query = new Parse.Query(DesktopGroup);
		query.equalTo('zone', zone);
		query.include("desktops.user");
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
	}

	function setDeskUser(req, res){
		var deskId = req.params.id;
		var userId = req.params.userId;
		console.log('deskId ' + deskId);
		console.log('userId ' + userId);
		var query = new Parse.Query(Desktop);
		query.get(deskId, {
			success: function(desk) {
				if(userId != 0){
					var secondQuery = new Parse.Query(User);
					secondQuery.get(userId, {
						success: function(user) {
							desk.set('user', user);
							desk.save();
							console.log(user);

							res.json(toJSON(desk));
						},
						error: function(object, error){
							console.log('query user error');
						},
					});
				}else{
					desk.unset('user');
					desk.save();

					res.json(toJSON(desk));
				}
			},
			error: function(object, error){
				console.log('query desk error');
			},
		});
	}

	function toJSON(desktopGroup){
		var result = {
			objectId: desktopGroup.id,
			name: desktopGroup.get('name'),
		};
		if(desktopGroup.has('desktops')){

			var desktops = new Array();
			desktopGroup.get('desktops').forEach(function(itDesktop){
				var desktop = {
					objectId: itDesktop.id,
					name: itDesktop.get('name'),
					phone: itDesktop.get('phone'),
					user: itDesktop.get('user')?
					{
						objectId: itDesktop.get('user').id,
						username: itDesktop.get('user').getUsername(),
						email: itDesktop.get('user').getEmail(),
						fullname: itDesktop.get('user').get('fullname'),
						firstname: itDesktop.get('user').get('firstname'),
						lastname: itDesktop.get('user').get('lastname'),
						free: 1,
					}:undefined,
				}
				desktops.push(desktop);
			});
			result.desktops = desktops;
		}
		return result;
	}

	function error(object, error) {
		console.error('Error');
		console.error(object);
		console.error(error);
	}

	return app;
}();