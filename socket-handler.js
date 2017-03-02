var db = require('./db/db-controller');

var socketHandler = function(socket, io) {

	socket.on('create quest', function(quest) {
    console.log('create quest received', quest);
		db.addQuest(quest).then(function(allQuests) { 
			io.emit('trigger update quests', allQuests);
      console.log('trigger update quests', allQuests);
		})
	});

	socket.on('create character', function(character) {
		db.createCharacter(character).then(function() {
			db.getCharacter(character.user_id).then(function(newCharacter) {
				socket.emit('update character', newCharacter[0]);
			});
		});
	});

	socket.on('get quests', function(characterId) {
    console.log('get quests', characterId);
		db.getAllQuests(characterId).then(function(allQuests) {
      socket.emit('update quests', allQuests);
		});
	});

	socket.on('get character', function(id) {
    console.log('get character', id);
		db.getCharacter(id).then(function(character) {
			if (!character.length) {
				socket.emit('make character');
			} else {
				socket.emit('update character', character[0]); 
			}
		});
	});

	socket.on('complete quest', function(characterId, questId) {
    console.log('complete quest', characterId, questId);
		db.completeQuest(characterId, questId).then(function() {
			db.getQuest(questId).then(function(quest) {
				db.getCharacter(characterId).then(function(character) {
					character = character[0];
					character.experience = character.experience + quest.experience;
					if (character.experience >= 100) {
						character.level = character.level + 1;
						character.experience = character.experience - 100;
						db.updateCharacter(character).then(function() {
							db.getCharacter(character.id).then(function(updatedCharacter) {
								socket.emit('update character', updatedCharacter);
								io.emit('trigger update quests');
							});
						});
					} else {
						db.updateCharacter(character).then(function() {
							db.getCharacter(character.id).then(function(updatedCharacter) {
								socket.emit('update character', updatedCharacter);
								io.emit('trigger update quests');
							});
						});
					}
				});
			});
		});
	});

	socket.on('activate quest', function(characterId, questId) {
		db.activateQuest(characterId, questId).then(function() {
			db.getAllQuests(characterId).then(function(allQuests) {
				socket.emit('update quests', allQuests);
			});
		});
	});

	socket.on('deactivate quest', function(characterId, questId) {
		db.deactivateQuest(characterId, questId).then(function() {
			db.getAllQuests(characterId).then(function(allQuests) {
				socket.emit('update quests', allQuests);
			});
		});
	});
}

module.exports = socketHandler