var db = require('./db/db-controller');

var socketHandler = function(socket, io, sockets, users, parties, leaveParty) {

	socket.on('create party', function(id) {
		db.getCharacter(id).then(function(character) {
			parties[character[0].id] = {sockets: [socket], characters: [character[0]]};
			socket.emit('party created');
			socket.emit('update party', parties[character[0].id].characters);
		});
	});

	socket.on('add to party', function(characterId, targetName) {
		db.getCharacterByName(targetName).then(function(target) {
			target = target[0];
			if (target)	{
				if (users[target.id]) {
					if (!parties[target.id]) {
						db.getCharacter(characterId).then(function(inviter) {
							inviter = inviter[0];
							users[target.id].emit('party invite', {inviter: inviter, invitee: target});
						});
					} else {
						socket.emit('reject user already in party', target);
					}
				} else {
					socket.emit('reject user not online', target);
				}
			} else {
				socket.emit('reject user does not exist', target);
			}
		});
	});

	socket.on('leave party', leaveParty);

	socket.on('accept party invite', function(invite) {
		var invitee = invite.invitee;
		var inviter = invite.inviter;
		parties[inviter.id].sockets.push(users[invitee.id]);
		parties[inviter.id].characters.push(invitee);
		parties[invitee.id] = parties[inviter.id];
		parties[inviter.id].sockets.forEach(function(player) {
			player.emit('update party', parties[inviter.id].characters);
		});
	});

	socket.on('reject party invite', function(invite) {
		var invitee = invite.invitee;
		var inviter = invite.inviter;
		users[inviter.id].emit('reject party invite', invitee);
	});

	socket.on('get party', function(characterId) {
		socket.emit('update party', parties[characterId].characters);
	});

	socket.on('create quest', function(quest) {
		db.addQuest(quest).then(function(allQuests) { 
			io.emit('trigger update quests', allQuests);
		})
	});

	socket.on('create character', function(character) {
		db.createCharacter(character).then(function() {
			db.getCharacter(character.user_id).then(function(newCharacter) {
				users[newCharacter[0].id] = socket;
				sockets[socket.id] = character[0];
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
				sockets[socket.id] = character[0];
				socket.emit('update character', character[0]); 
			}
		});
	});

	socket.on('complete quest', function(characterId, questId) {
		db.completeQuest(characterId, questId).then(function() {
			db.getQuest(questId).then(function(quest) {
				quest = quest[0];
				db.getCharacterById(characterId).then(function(character) {
					character = character[0];
					if (parties[character.id]) {
						parties[character.id].characters.forEach(function(character, i) {
							var hourDuration = Math.floor((Date.now() - quest.timestamp) / 3600000) + 2;
							character.experience = character.experience + (hourDuration * 2);
							if (character.experience >= 100) {
								character.level = character.level + 1;
								character.experience = character.experience - 100;
								db.updateCharacter(character).then(function() {
									db.getCharacterById(character.id).then(function(updatedCharacter) {
										parties[character.id].sockets[i].emit('update character', updatedCharacter[0]);
										io.emit('trigger update quests');
									});
								});
							} else {
								db.updateCharacter(character).then(function() {
									db.getCharacterById(character.id).then(function(updatedCharacter) {
										parties[character.id].sockets[i].emit('update character', updatedCharacter[0]);
										io.emit('trigger update quests');
									});
								});
							}
						});
					} else {
						var hourDuration = Math.floor((Date.now() - quest.timestamp) / 3600000) + 2;
						character.experience = character.experience + (hourDuration * 2);
						if (character.experience >= 100) {
							character.level = character.level + 1;
							character.experience = character.experience - 100;
							db.updateCharacter(character).then(function() {
								db.getCharacterById(character.id).then(function(updatedCharacter) {
									socket.emit('update character', updatedCharacter[0]);
									io.emit('trigger update quests');
								});
							});
						} else {
							db.updateCharacter(character).then(function() {
								db.getCharacterById(character.id).then(function(updatedCharacter) {
									socket.emit('update character', updatedCharacter[0]);
									io.emit('trigger update quests');
								});
							});
						}
					}
				});

				db.getCharacterById(quest['creator_id']).then(function(character) {
					character = character[0];
					var hourDuration = Math.floor((Date.now() - quest.timestamp) / 3600000);
					character.experience = character.experience + hourDuration;
					if (character.experience >= 100) {
						character.level = character.level + 1;
						character.experience = character.experience - 100;
						db.updateCharacter(character).then(function() {
							db.getCharacterById(character.id).then(function(updatedCharacter) {
								if (users['creator_id']) {
									user.emit('update character', updatedCharacter[0]);	
								}
							});
						});
					} else {
						db.updateCharacter(character).then(function() {
							db.getCharacterById(character.id).then(function(updatedCharacter) {
								if (users['creator_id']) {
									user.emit('update character', updatedCharacter[0]);	
								}
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


module.exports.socketHandler = socketHandler;
