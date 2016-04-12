// shared canvas using socket.io

var http = require('http').createServer(handler);
var url = require('url');
var path = require('path');
var fs = require('fs');
var sio = require('socket.io').listen(http);
var port = 8080;

http.listen(port);

function handler(request, response) {
  var uri = url.parse(request.url).pathname;
  var filename = 'public' + uri;

  console.log('file "' + filename + '" was requested.');

  fs.exists(filename, function(exists) {
      //Incase the filename could not be found
      if(!exists) {
        response.writeHead(404, {"Content-Type": "text/plain"});
        response.write("404 Not Found\n");
        response.end();
        return;
      }

      //Incase the filename is a directory, append /index.html
      if (fs.statSync(filename).isDirectory())
        filename += '/index.html';

      //Write the file contents to response
      fs.readFile(filename, "binary", function(err, file) {
        //Error reading file
        if(err) {
          response.writeHead(500, {"Content-Type": "text/plain"});
          response.write(err + "\n");
          response.end();
          return;
        }

        response.writeHead(200);
        response.write(file, "binary");
        response.end();
      });

    });
}
