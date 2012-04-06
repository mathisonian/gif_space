var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

GifProvider = function(host, port){
    this.db = new Db('node-mongo-gif', new Server(host, port,{auto_reconnect: true}, {}));
    this.db.open(function(){});
};


GifProvider.prototype.getCollection= function(callback) {
  this.db.collection('gifs', function(error, gif_collection) {
    if( error ) callback(error);
    else callback(null, gif_collection);
  });
};

GifProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, gif_collection) {
        if(error) callback(error)
        else {
            gif_collection.find().toArray(function(error, results) {
                if(error) callback(error)
                else callback(null, results)
            });
        }
    });
};

GifProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, gif_collection) {
      if( error ) callback(error)
      else {
        gif_collection.findOne({_id: gif_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};

GifProvider.prototype.save = function(gifs, callback) {
    this.getCollection(function(error, gif_collection) {
      if( error ) callback(error)
      else {
        if( typeof(gifs.length)=="undefined")
          gifs = [gifs];

        for( var i =0;i< gifs.length;i++ ) {
          gif = gifs[i];
          gif.created_at = new Date();
          if( gif.filename === undefined ) gif.comments = [];
        }

        gif_collection.insert(gifs, function() {
          callback(null, gifs);
        });
      }
    });
};

exports.GifProvider = GifProvider;