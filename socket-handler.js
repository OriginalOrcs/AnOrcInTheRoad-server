var db = require('./db/db-controller');

var socketHandler = function(socket, io) {

  socket.on('super', function(data) {
		io.emit('super', { message: 'Got it' })
	});

	socket.on('user login', function(user) {
		console.log('AUTH WORKED!!!')
		// db.authUser();
	});

	socket.on('add quest', function(quest) {
		db.addQuest(quest).then(function(allQuests) {
			io.emit('update quests', allQuests);
		})
	});

	socket.on('get quests', function() {
		db.getAllQuests().then(function(allQuests) {
			socket.emit('update quests', allQuests);
		});
	});

	socket.on('get character', function(id) {
		db.getCharacter(id).then(function(character) {
			socket.emit('update character', character);
		});
	});

	socket.on('complete quest', function(userId, questId) {
		db.completeQuest(userId, questId).then(function() {
			db.getAllQuests().then(function(allQuests) {
				socket.emit('update quests', allQuests);
			});
		});
	});
}

module.exports = socketHandler