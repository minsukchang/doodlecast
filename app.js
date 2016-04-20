// shared canvas using socket.io
var args = process.argv.slice(2);
var path = require('path');

var express = require('express');
var app = express();
var http = require('http').Server(app);
var sio = require('socket.io')(http);

var port = args[0];

app.use("/public", express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('index');
});

http.listen(port);

sio.sockets.on('connection', function(socket){
  console.log('user connected to socket')
  socket.on('user-draw', function(msg) {
    socket.broadcast.emit('server-draw', msg);
  });
});
