var Model = require('../model/model.js');
var Album = require('../model/album.js');
var Photo = require('../model/photo.js');

var model = new Model();

var PhotoAlbumController = function() {};
PhotoAlbumController.prototype.getAlbums = function(){
	return model.albums;
}
PhotoAlbumController.prototype.countAlbums = function(){
	return model.albums.length;
}
PhotoAlbumController.prototype.addAlbum = function(albumName){
	if(typeof(albumName) === 'string'){
		if(!getAlbumByName(albumName)){
			console.log('album ' + albumName + ' not found and will be inserted');
			model.albums.push(new Album(albumName));
			return true;
		}
	}
	return false;
}
PhotoAlbumController.prototype.getAlbum = function(albumName){
	if(typeof(albumName) === 'string'){
    return(getAlbumByName(albumName));
	} else {
		return false
	}
}
PhotoAlbumController.prototype.deleteAlbum = function(albumName){
	if(typeof(albumName) === 'string'){
		var album = getAlbumByName(albumName);
		if(album){
			var index = model.albums.indexOf(album);
			model.albums.splice(index, 1);
			return true;
		} else {
			return false;
		}
	}
}
PhotoAlbumController.prototype.renameAlbum = function(album, newName){
  var album = getAlbumByName(album);
	if(album && typeof(newName) === 'string'){
		album.title = newName;
		return true;
	}
	return false;
}

PhotoAlbumController.prototype.addPhotoToAlbum = function(fileName, albumName){
  var album = getAlbumByName(albumName);
	if(album && !getPhotoByName(album, fileName)){
		album.photos.push(new Photo(fileName));
		console.log('photo added successfully');
		return true;
	}
	console.log('photo not added successfully');
	return false;
}

//internal functions
function getAlbumByName(albumName){
	for(var i = 0; i < model.albums.length; i++){
		if(model.albums[i].title === albumName){
			return model.albums[i];
		}
	}
	return false;
}
function getPhotoByName(album, photoName){
	for(var i = 0; i < album.photos.length; i++){
		if(album.photos[i].filename === photoName);
		  return album.photos[i];
	}
	return false;
}


module.exports = PhotoAlbumController;
