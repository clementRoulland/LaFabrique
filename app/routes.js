// app/routes.js
module.exports = function(app, passport) {

    // Redirect the user to Google for authentication.  When complete, Google
    // will redirect the user back to the application at /auth/google/return
    app.get('/auth/google', passport.authenticate('google'));

    // Google will redirect the user to this URL after authentication.  Finish
    // the process by verifying the assertion.  If valid, the user will be
    // logged in.  Otherwise, authentication has failed.
    app.get('/auth/google/return', passport.authenticate('google', { successRedirect: '/', failureRedirect: '/login' }));

    app.get('/login', function(req, res) {
    	if(req.isAuthenticated()) { res.redirect('/') }
    	res.render('user/login');
    });

    app.get('/logout', ensureAuthenticated, function(req, res) {
    	req.logout();
    	req.user = undefined;
    	res.redirect('/login');
    });

    app.get('/', ensureAuthenticated, function(req, res) {
    	console.log(req.user);
    	res.render('index'); // load the index.ejs file
    });

    app.use(function(req, res){
    	res.redirect('/');
    });

};

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}