// Provides endpoints for user signup and login

module.exports = function(){
	var express = require('express');
	var app = express();
    var User = Parse.User;
    var authentication = require('cloud/tools/require-user.js');

    app.get('/', authentication, getAll);

	// Render the login page
	app.get('/login', function(req, res) {
		console.log('GET LOGIN');
		res.render('user/login',{});
	});

	// Logs in the user
	app.post('/login', function(req, res) {
		console.log('POST LOGIN');
		Parse.User.logIn(req.body.username, req.body.password).then(function(user) {
			res.redirect('/');
		}, function(error) {
			// Show the error message and let the user try again
			console.log('LogIn error: ' + error.message);
			res.render('user/login', { flash: error.message });
		});
	});

	// Logs out the user
	app.get('/logout', function(req, res) {
		Parse.User.logOut();
		res.redirect('/');
	});

    function getAll(res, res) {
        var query = new Parse.Query(User);
        query.find({
            success: function (results) {
                var users = new Array();
                results.forEach(function(user){
                    var userToJson = toJSON(user);
                    users.push(userToJson);
                });
                res.json(users);
            },
            error: error
        });
	}

	function toJSON(user){
		return {
			username: user.getUsername(),
			email: user.getEmail(),
			fullname: user.get('fullname'),
			firstname: user.get('firstname'),
			lastname: user.get('lastname'),
		};
	}

    function error(object, error) {
        console.error(error);
        error.status = 'ko';
        res.json(error);
    }

	return app;
}();