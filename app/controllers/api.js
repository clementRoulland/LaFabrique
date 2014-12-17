// Provides endpoints for user signup and login

module.exports = function(){
	var express = require('express');
	var app = express();

	var https = require('https');
	var server = app.listen(3000, function () {
	});

	var google = require('googleapis');
	var OAuth2Client = google.auth.OAuth2;
	var calendar = google.calendar('v3');

	var oauth2Client = new OAuth2Client('1093274570499-3254tc7cprnadm7m0j9ko91v40grk3ng.apps.googleusercontent.com', '4KIVhxIjpNCi6lrJmkm9Izi2', 'http://127.0.0.1:3000/oauth2callback');


	app.get('/', function (req, res) {
		// generate a url that asks permissions for Google+ and Google Calendar scopes
		var scopes = [
			'https://www.google.com/m8/feeds',
			'https://www.googleapis.com/auth/calendar'
		];

		var url = oauth2Client.generateAuthUrl({
			access_type: 'online', // 'online' (default) or 'offline' (gets refresh_token)
			scope: scopes // If you only need one scope you can pass it as string

		});

		res.redirect(url);

	});
	app.get('/oauth2callback', function (req, res) {
		oauth2Client.getToken(req.query.code, function (err, tokens) {
			oauth2Client.setCredentials(tokens);
			res.redirect('/people');
		});
	});

	app.get('/calendar', function (req, res) {
		var calendar = google.calendar({version: 'v3'});

		// retrieve user profile
		calendar.events.list({
			calendarId: 'digitaleo.com_31343731343939352d363235@resource.calendar.google.com',
			auth: oauth2Client
		}, function (err, profile) {
			if (err) {
				console.log('An error occured', err);
				return;
			}

			console.log(profile);
		});
	});

	app.get('/people', function (req, res) {
		var request = https.request({
			hostname: 'www.google.com',
			path: '/m8/feeds/contacts/jcoelho@digitaleo.com/full?alt=json',
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + oauth2Client.credentials.access_token
			}
		}, function (res) {
			console.log('STATUS: ' + res.statusCode);
			console.log('HEADERS: ' + JSON.stringify(res.headers));
			res.setEncoding('utf8');
			res.on('data', function (chunk) {
				console.log('BODY: ' + chunk);
			});
		});
		request.on('error', function (e) {
			console.log('problem with request: ' + e.message);
		}).end();

	});



	return app;
}();