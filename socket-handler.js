var db = require('./db/db-controller')

var socketHandler = function(socket, io) {
	socket.on('disconnect', function() {
		sockets.splice(userIndex, 1);
		console.log('User Disconnected ' + sockets.length + ' Socket(s) Upheld')
	});

  socket.on('super', function(data) {
		io.emit('super', {message: 'Got it'})
	});

	socket.on('new quest', db.addQuest);
}

module.exports = socketHandler