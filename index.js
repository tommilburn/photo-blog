var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var env = require('env2')('./.env');

var app = express();
app.set('view engine', 'pug');
app.use(express.static('static'));

mongoose.connect('mongodb://localhost/photosite/');
var Photo = mongoose.model('Photo', 
		{
			filename: {type: String, unique: true}, 
			title: String,
			orientation: {type: String, enum: ['portrait', 'landscape']}
		});

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res){
	var photos = Photo.find().sort('filename').exec(function(err, data){
	res.render("simple.pug", {photos: data});
	});
});

app.get('/admin', function(req, res){
	res.render("admin.pug", {array: ["uh", 2, 3, 4, 5]});
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

app.listen(4001);
