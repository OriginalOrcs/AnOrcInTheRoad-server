var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var socketHandler = require('./socket-handler').socketHandler;
var leaveParty = require('./socket-handler').leaveParty;

var port = process.env.port || 3000
server.listen(port);
console.log('Listening on port: ' + port);

var sockets = {};

var users = {};

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
	console.log('User Connected, ' + sockets.length + ' Socket(s) Upheld');

	socket.on('disconnect', function() {
		console.log('User Disconnected ' + sockets.length + ' Socket(s) Upheld')
		delete users[sockets[socket.id]];
		leaveParty(sockets[socket.id]);
	});

	socketHandler(socket, io, sockets, users);
});