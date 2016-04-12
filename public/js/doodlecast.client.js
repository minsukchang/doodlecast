$(function(){
  //Client side script for DoodleCast
  var server = 'http://localhost:8080';
  var socket = io(server);

  var doc = $(document);
  var canvas = $('#Canvas');
  var ctx = canvas[0].getContext('2d');

  var id = Math.round($.now() * Math.random());
  var drawing = false;

  canvas.on('mousedown', function(e) { drawing = true; });
  doc.on('mouseup mouseleave', function(e) { drawing = false; });

  doc.on('mousemove', function(e) {
      if(drawing == true) {
        socket.emit('user-draw', {
          'x': e.pageX,
          'y': e.pageY,
          'id': id
          });
      }
  });

  socket.on('server-draw', function(data) {
    console.log('server-draw');
    console.log(JSON.stringify(data));
  });

});
