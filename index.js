var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var env = require('env2')('./.env');

console.log(process.env.PHOTO_PASS);

var app = express();
app.set('view engine', 'pug');

mongoose.connect('mongodb://localhost/photos');
var Photo = mongoose.model('Photo', {filename: String, title: String});

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res){
	res.render("simple.pug", {photos: ["00001.jpg", "00002.jpg", 3, 4, 5]});
});

app.get('/admin', function(req, res){
	res.render("admin.pug", {array: ["uh", 2, 3, 4, 5]});
});
app.post('/admin', function(req, res){
  console.log("post request");
	if(req.body.password === process.env.PHOTO_PASS){
		console.log('correct password');
		console.log(req.body)
	};
});

app.listen(4001);
