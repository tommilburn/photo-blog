var photo = require('./photo');

var Album = function(title) {
  this.title = title;
	this.photos = [];
};


Album.prototype.title = "";
Album.prototype.description = "";

module.exports = Album;
