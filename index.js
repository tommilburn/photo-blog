var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var sessions = require('client-sessions');
var env = require('env2')('./.env');

var app = express();
app.set('view engine', 'pug');
app.use(express.static('static'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(sessions({
	cookieName: 'session',
	secret: process.env.PHOTO_PASS,
	duration: 24 * 60 * 60 * 1000,
	activeDuration: 1000 * 60 * 5,
  cookie: {
		httpOnly: true
	}
}));
/*
app.use(function(req, res, next){
	if(req.session && req.session.user){
		User.findOne({username:req.session.user.username}, function(err, user){
			if(user){
				req.user = user;
				delete req.user.password;
				req.session.user = req.user;
				req.locals.user = req.user;
				next();
		  } else {
				req.session.reset();
				res.redirect('/');
				next();
			}
    })
	} else {
		next();
	}
});
*/
mongoose.connect('mongodb://localhost/photosite/');
var Photo = new mongoose.Schema({
	filename: {type: String, unique: true}, 
	title: String,
	orientation: {type: String, enum: ['portrait', 'landscape']},
	hexCode: {type: String},
	order: Number
});

var Album = new mongoose.Schema({
	title: {type: String, unique: true},
	photos: [Photo]
});

var Photos = mongoose.model("Photo", Photo);
var Albums = mongoose.model('Album', Album);
var User = mongoose.model("user", new mongoose.Schema({
	Username: {type: String, unique: true},
	password: String,
	userclass: String
}));

app.get('/', function(req, res){
	console.log('/');
	res.send('hello world');
//	var photos = Photos.find().sort('filename').exec(function(err, data){
//		res.render("simple.pug", {photos: data});
//	});
});

app.get('/admin', function(req, res){
	res.render("admin.pug");
});

app.post('/admin', function(req, res){
  console.log("post request");
	if(req.body.password === process.env.PHOTO_PASS){
		console.log('correct password');
		if(req.body.filename && req.body.title){
			var p = new Photo({filename: req.body.filename, title: req.body.title});
			p.save(function(err){
				if(err){
					console.log('error: ' + err)
				} else {
					console.log("created photo");
					res.redirect('/admin');
				}
			});
		};
	}
});

app.get('/album/:albumName', function(req, res){
	console.log(req.params);
	var albums = Albums.find({name: req.params.albumName}).exec(function(err, data){
		if(err) console.log(err)
		console.log("data: " + data.photos);
	});
});

var port = 4002;
app.listen(port);
console.log('here we go! port ' + port);
