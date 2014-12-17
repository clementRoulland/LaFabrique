
// These two lines are required to initialize Express in Cloud Code.
var express  		= require('express');
var app      		= express();
var port     		= process.env.PORT || 8080;
var passport 		= require('passport');
var GoogleStrategy 	= require('passport-google').Strategy;
var flash    		= require('connect-flash');

var cookieParser 	= require('cookie-parser');
var bodyParser   	= require('body-parser');
var methodOverride 	= require('method-override');
var session      	= require('express-session');

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new GoogleStrategy({
    returnURL: 'http://127.0.0.1:' + port + '/auth/google/return',
    realm: 'http://127.0.0.1:' + port + '/'
  },
  function(identifier, profile, done) {
  	console.log('identifier | ' + identifier);
  	console.log('profile | ' + profile);
  	console.log(profile);
  	console.log('done | ' + done);
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's Google profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Google account with a user record in your database,
      // and return that user instead.
      profile.identifier = identifier;
      return done(null, profile);
    });
  }
));

// Global app configuration section
app.set('views', 'app/views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template 
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
app.use(methodOverride());
app.use(express.static('public'));
app.use(session({ secret: 'lafabr!que20D!g!taleo' })); // session secret

app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); // use connect-flash for flash messages stored in session

require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);

console.log('Ready on http://localhost:' + port);