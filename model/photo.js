var Photo = function(filename, index) {
  this.filename = filename;
	if(index > 0){
		this.index = index;
	}
};

Photo.prototype.filename = "";
Photo.prototype.url = "";
Photo.prototype.height = "";
Photo.prototype.width = "";
Photo.prototype.index = -1;

module.exports = Photo;
