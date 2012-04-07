var express = require('express');
var GifProvider = require('./gifprovider-memory').GifProvider;
var fs = require('fs');

var app = module.exports = express.createServer();


app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

var gifProvider = new GifProvider('localhost', 27017);

app.get('/', function(req, res){
    gifProvider.findAll( function(error,docs){
        res.render('index.jade', { locals: {
            title: 'SPACE HALL',
            gifs:docs,
            time: new Date().getTime()
            }
        });
    })
});

// we need the fs module for moving the uploaded files
app.post('/file-upload', function(req, res) {
    var newDate = new Date;
    var namestr = newDate.getTime();
    if(req.files.files[0].type != "image/gif") return;
    // get the temporary location of the file
    var tmp_path = req.files.files[0].path;
    // set where the file should actually exists - in this case it is in the "images" directory
    var target_path = './public/images/' + namestr + '.gif';
    gifProvider.save({
        filename: namestr + '.gif'
    }, function( error, docs) {
        res.redirect('/')
    });
    // move the file from the temporary location to the intended location
    fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
        fs.unlink(tmp_path, function() {
            if (err) throw err;
        });
    });
    io.sockets.emit("newfile", {filename : namestr});
});

app.listen(8080);


var io = require('socket.io').listen(app);
