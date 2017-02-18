var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var socketHandler = require('./socket-handler');

server.listen(3000);
console.log('Listening');

var sockets = [];

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
	sockets.push(socket);
	console.log('User Connected, ' + sockets.length + ' Socket(s) Upheld');
	var userIndex = sockets.length - 1;

	socketHandler(socket, io);
});