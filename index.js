var env = require('env2')('.env');
var express = require('express');
var session = require('client-sessions');
var bodyParser = require('body-parser');
var Controller = require('./controller/controller.js');
var querystring = require('querystring');

var app = express();
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({extended: false}));

var controller = new Controller();
controller.addAlbum('test');
controller.addAlbum('uh');
controller.addPhotoToAlbum('test', 'testPhoto1');
controller.addPhotoToAlbum('test', 'testPhoto2');

app.use(session({
	cookieName: 'session',
	secret: process.env.SESSION_SECRET,
	duration: 30 * 60 * 1000,
	activeDuration: 5 * 60 * 1000
}));
app.use(function(req, res, next){
	if(req.session && req.session.user){
		if(req.session.user === process.env.ADMIN_USERNAME + " " + process.env.ADMIN_PASSWORD){
			res.locals.userLoggedIn = true;
			console.log('admin logged in');
		} else {
			res.locals.userLoggedIn = false;
			console.log('admin not right password');
		}
		next();
	} else {
		console.log('admin no session');
		next();
	}
});
function requireLogin(req, res, next){
  if(!req.session.user){
		res.redirect('/login');
	} else {
		next();
	}
};
app.get('/', function(req, res){
  res.json(controller.getAlbums());
});
app.post('/login', function(req, res){
	if(req.body.password === process.env.ADMIN_PASSWORD && req.body.username === process.env.ADMIN_USERNAME){
		req.session.user = process.env.ADMIN_USERNAME + " " + process.env.ADMIN_PASSWORD;
		res.redirect('/admin');
	}	else{
		res.send('nope');
  }
});
app.get('/login', function(req, res){
	res.render('login.pug')
})
app.get('/admin', requireLogin, renderAdminPage);
function renderAdminPage(req, res){
	res.render('admin.pug', {
		albums: controller.getAlbums(),
		notification: req.query.notification
	});
};
app.get('/logout', function(req, res){
	req.session.reset();
	res.redirect('/');
});
app.get('/admin/addAlbum', function(req, res){
	if(req.query.albumName){
		if(controller.addAlbum(req.query.albumName)){
			var notification = encodeURIComponent('album ' + req.query.albumName + " added successfully");
		} else {
			var notification = encodeURIComponent('album ' + req.query.albumName + " already exists");
		}
	} else {
		var notification = encodeURIComponent("album name improperly formatted");
	}
	res.redirect('/admin?notification=' + notification);
})

app.get('/admin/deleteAlbum', function(req, res){
	if(req.query.albumName){
		controller.deleteAlbum(req.query.albumName);
		var notification = encodeURIComponent('album ' + req.query.albumName + " deleted successfully");
		res.redirect('/admin?notification=' + notification);
	}
})
app.get('/admin/album/:albumName/', function(req, res){
  res.render('adminAlbum.pug', {album: controller.getAlbum(req.params.albumName)});
});

var port = process.env.PORT || 5000;

app.listen(5000);
console.log('listening on port ' + port);
