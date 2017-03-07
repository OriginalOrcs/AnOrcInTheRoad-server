var db = require('./db/db-controller');

var parties = {};

var users = {};

var socketHandler = function(socket, io, users) {

	socket.on('create party', function(characterId) {
		db.getCharacter(characterId).then(function(character) {
			parties[characterId] = {sockets: [socket], characters: [character]};
			socket.emit('party created');
			socket.emit('update party', parties[characterId]);
		});
	});

	socket.on('add to party', function(characterId, targetName) {
		db.getCharacterByName(targetName).then(function(target) {
			if (!parties[target.id]) {
				db.getCharacter(characterId).then(function(inviter) {
					users[target.id].emit('party invite', {inviter: inviter, invitee: target});
				});
			} else {
				socket.emit('reject user already in party');
			}
		});
	});

	socket.on('leave party', function(characterId) {
		parties[characterId].characters.forEach(function(character, i) {
			if (character.id === characterId) {
				var sockets = parties[characterId].sockets.slice();
				parties[characterId].characters.splice(i, 1);
				parties[characterId].sockets.splice(i, 1);
				parties[characterId] = undefined;
				parties[characterId].characters.forEach(function(character, i) {
					parties[character.id].socket[i].emit('update party', parties[character.id]);
				});
			}
		});
	});

	socket.on('accept party invite', function(invite) {
		var invitee = invite.invitee;
		var inviter = invite.inviter;
		parties[inviter.id].sockets.push(users[invitee.id]);
		parties[inviter.id].characters.push(invitee);
		parties[invitee.id] = parties[inviter.id];
		parties[inviter.id].forEach(function(player) {
			player.emit('update party', parties[player.id]);
		});
	});

	socket.on('reject party invite', function(invite) {
		var invitee = invite.invitee;
		var inviter = invite.inviter;
		users[inviter.id].emit('reject party invite', invitee);
	});

	socket.on('get party', function(characterId) {
		socket.emit('update party', parties[characterId]);
	});

	socket.on('create quest', function(quest) {
		db.addQuest(quest).then(function(allQuests) { 
			io.emit('trigger update quests', allQuests);
		})
	});

	socket.on('create character', function(character) {
		db.createCharacter(character).then(function() {
			db.getCharacter(character.user_id).then(function(newCharacter) {
				users[character[0].id] = socket;
				socket.emit('update character', newCharacter[0]);
			});
		});
	});

	socket.on('get quests', function(characterId) {
		db.getAllQuests(characterId).then(function(allQuests) {
      socket.emit('update quests', allQuests);
		});
	});

	socket.on('get character', function(id) {
		db.getCharacter(id).then(function(character) {
			if (!character.length) {
				socket.emit('make character');
			} else {
				users[character[0].id] = socket;
				socket.emit('update character', character[0]); 
			}
		});
	});

	socket.on('complete quest', function(characterId, questId) {
		db.completeQuest(characterId, questId).then(function() {
			db.getQuest(questId).then(function(quest) {
				db.getCharacter(characterId).then(function(character) {
					character = character[0];
					if (parties[character.id]) {
						parties[character.id].characters.forEach(function(character, i) {
							character.experience = character.experience + quest.experience;
							if (character.experience >= 100) {
								character.level = character.level + 1;
								character.experience = character.experience - 100;
								db.updateCharacter(character).then(function() {
									db.getCharacter(character.id).then(function(updatedCharacter) {
										parties[character.id].sockets[i].emit('update character', updatedCharacter);
										io.emit('trigger update quests');
									});
								});
							} else {
								db.updateCharacter(character).then(function() {
									db.getCharacter(character.id).then(function(updatedCharacter) {
										parties[character.id].sockets[i].emit('update character', updatedCharacter);
										io.emit('trigger update quests');
									});
								});
							}
						});
					} else {
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