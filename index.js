var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var app = express();
app.set('view engine', 'pug');

mongoose.connect('mongodb://localhost/photos');
var Photo = mongoose.model('Photo', {filename: String, title: String});

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res){
	res.render("simpleview.pug", {array: ["uh", 2, 3, 4, 5]});
});

app.post('/', function(req, res){
  console.log("post request");
	console.log(req.body)
});

app.listen(4001);
