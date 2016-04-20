$(function() {
  //Client side script for DoodleCast
  var server = 'http://198.96.36.24:12000';
  var socket = io(server);

  var doc = $(document);
  var canvas = $('#Canvas');
  var ctx = canvas[0].getContext('2d');
  var prev = {};

  var id = Math.round($.now() * Math.random());
  var drawing = false;

  var clients = {};

  canvas.on('mousedown touchstart', function(e) {
    e.preventDefault();

    prev.x = ( (e.type == 'touchstart') ? ( parseInt(e.originalEvent.touches[0].pageX)) : (e.pageX) ) - canvas.offset().left;
    prev.y = ( (e.type == 'touchstart') ? ( parseInt(e.originalEvent.touches[0].pageY)) : (e.pageY) ) - canvas.offset().top;

    drawing = true;
  });

  canvas.bind('mousemove touchmove', function(e) {
    e.preventDefault();

    if(drawing) {

      cur_x = ( (e.type == 'touchmove') ? ( parseInt(e.originalEvent.touches[0].pageX)) : (e.pageX) ) - canvas.offset().left;
      cur_y= ( (e.type == 'touchmove') ? ( parseInt(e.originalEvent.touches[0].pageY)) : (e.pageY) ) - canvas.offset().top;
      
      drawLine(prev.x, prev.y, cur_x, cur_y, 5, 0, 0, 0, 1);

      socket.emit('user-draw', {
        'id': id,
        'drawing': drawing,
        'x1': prev.x,
        'y1': prev.y,
        'x2': cur_x,
        'y2': cur_y
      });

      prev.x = cur_x;
      prev.y = cur_y;
    }
  });

  doc.bind('mouseup mouseleave touchend', function(e) {
    drawing = false;
  });

  socket.on('server-draw', function(data) {
    drawLine(data.x1, data.y1, data.x2, data.y2, 5, 0, 0, 0, 1);
  });

  function drawLine(x1, y1, x2, y2, lineWidth, r, g, b, a) {
    var lx = x2 - x1;
    var ly = y2 - y1;

    var lineLength = Math.sqrt(lx*lx + ly*ly);

    var wy = lx / lineLength * lineWidth;
    var wx = ly / lineLength * lineWidth;

    var gradient = ctx.createLinearGradient(x1-wx/2, y1+wy/2, x1+wx/2, y1-wy/2);

    gradient.addColorStop(0,    "rgba("+r+","+g+","+b+",0)");
    gradient.addColorStop(0.49, "rgba("+r+","+g+","+b+","+a+")");
    gradient.addColorStop(0.51, "rgba("+r+","+g+","+b+","+a+")");
    gradient.addColorStop(1,    "rgba("+r+","+g+","+b+",0)");

    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = gradient;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
});
