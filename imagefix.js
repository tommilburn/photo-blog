var mongoose = require('mongoose');
var util = require('util');
var sizeOf = require('image-size');
var ColorThief = require('color-thief');
var colorThief = new ColorThief();

mongoose.connect('mongodb://localhost/photosite/');
var Photo = mongoose.model('Photo', 
		{
			filename: {type: String, unique: true}, 
			title: String,
			orientation: {type: String, enum: ['portrait', 'landscape']},
			hexCode: {type: String}
		});
function setOrientation(){
	var photos = Photo.find().sort('filename').exec(function(err, data){
		console.log("image count: " + data.length);
		data.forEach(function(element){
			dimensions = sizeOf('./static/images/'+element.filename);
			if(element.orientation === undefined){
				if(dimensions.height > dimensions.width){
					element.orientation = 'portrait';
				} else {
					element.orientation = 'landscape';		
				}
				element.save(function (err){
					if(err){
						console.log(err);
					} else {
						console.log("element updated: " + element.filename + " " + element.orientation + " " + dimensions.height + " " + dimensions.width);	
					}
				});
			}
		});
	});
}
function setDominantColor(){
	var photos = Photo.find().sort('filename').exec(function(err, data){
		if(err){
			console.log(err);
			return;
		}
		console.log("image count: " + data.length);
		data.forEach(function(element){
			console.log(element.filename);
		  var	hexCode = arraytohex(colorThief.getColor('./static/images/'+element.filename));
			console.log(hexCode);
			element.hexCode = hexCode;
			element.save(function(err){
				if(err){
					console.log(err);
				} else {
					console.log("element color saved: " +element.filename + " " + element.hexCode);
			  }
		  });
		});
	});
};
function arraytohex(arr){
  var hexstr = ""
	arr.forEach(function(e){
		hexstr += e.toString(16);
  })
  return hexstr;
}
setDominantColor();
