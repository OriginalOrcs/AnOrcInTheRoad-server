var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var socketHandler = require('./socket-handler').socketHandler;

var port = process.env.port || 3000;
server.listen(port);
console.log('Listening on port: ' + port);

var sockets = {};

var users = {};

var parties = {};


var leaveParty = function(characterId) {
	parties[characterId].characters.forEach(function(character, i) {
		if (character.id === characterId) {
			parties[characterId].characters.splice(i, 1);
			parties[characterId].sockets.splice(i, 1);
			parties[characterId].sockets.forEach(function(socket, i) {
				socket.emit('update party', parties[sockets[socket.id]].characters);
			});
			delete parties[characterId];
			users[characterId].emit('update party', []);
		}
	});
}


app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
	console.log('User Connected, ' + sockets.length + ' Socket(s) Upheld');

	socket.on('disconnect', function() {
		console.log('User Disconnected ' + sockets.length + ' Socket(s) Upheld')
		if (parties[sockets[socket.id]]) {
			leaveParty(sockets[socket.id]);
		}
		delete users[sockets[socket.id]];
	});

	socketHandler(socket, io, sockets, users, parties, leaveParty);
});