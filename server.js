var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var socketHandler = require('./socket-handler');

var port = process.env.port || 3000
server.listen(port);
console.log('Listening on port: ' + port);

var sockets = [];

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
	sockets.push(socket);
	console.log('User Connected, ' + sockets.length + ' Socket(s) Upheld');
	var userIndex = sockets.length - 1;

	socket.on('disconnect', function() {
		sockets.splice(userIndex, 1);
		console.log('User Disconnected ' + sockets.length + ' Socket(s) Upheld')
	});

	socketHandler(socket, io);
});