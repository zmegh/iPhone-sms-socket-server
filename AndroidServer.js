var app = require('http').createServer(handler), io = require('socket.io').listen(app), fs = require('fs');

app.listen(5000);

var text = 'BRUNO';
var text2 = 'BRUNO2';

function handler (req, res) {
  fs.readFile('index.ejs',
  function (err, data) {
    if (err) {
      res.writeHead(500);
        console.log("Error loading index.ejs");
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

var clients = [];

io.sockets.on('connection', function (socket) {
    
    console.log("*******New User *******");
  socket.emit('news', text);
  socket.emit('news', text2);
  socket.send('BRUNO');
  socket.on('my other event', function (data) {
    console.log(data);
    console.log(Math.floor((Math.random()*10000)+1));
  });

  socket.on('name', function (data) {
    socket.set('name',data);
    console.log('BRUNOOOO');
    if (clients.length ==0 ) 
        clients.push(socket);
    else {
    socket2 = clients.pop()
    socket2.join('room');
    socket.join('room');
    io.sockets.in('room').emit('news','NOVA SALA');
    }
    socket.get('name', function (err, data) {
      socket.emit('news',data);
  });
  });
});