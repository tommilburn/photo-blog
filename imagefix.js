var mongoose = require('mongoose');
var util = require('util');
var sizeOf = require('image-size');

mongoose.connect('mongodb://localhost/photosite/');
var Photo = mongoose.model('Photo', 
		{
			filename: {type: String, unique: true}, 
			title: String,
			orientation: {type: String, enum: ['portrait', 'landscape']}
		});

var photos = Photo.find().sort('filename').exec(function(err, data){
	console.log(data.length);
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
