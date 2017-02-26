var Promise = require('bluebird');
var mysql = require('mysql');
// var redis = require('redis');
// Promise.promisifyAll(redis.RedisClient.prototype);
// Promise.promisifyAll(redis.Multi.prototype);
// var redisClient = redis.createClient();

var connection = mysql.createConnection({
  host: process.env.db || "localhost",
  database: "Orc",
  user: "root",
  password: ""
});

connection = Promise.promisifyAll(connection);

connection.connect();

// add quest router.
var addQuest = function(quest) {
	var that = this;
  console.log('addquest quest', quest);
  console.log(quest.questType);
  console.log(that[quest.questType]);
	return new Promise((resolve, reject) => {
		return that[quest.questType](quest).then(resolve);
	});
}

// adds a fetch quest to the db
var addFetchQuest = function(quest) {
	return new Promise(function(resolve, reject) {
		var bufferQuest = { name: quest.name, creator_id: quest.creator_id, experience: quest.experience, lat: quest.lat, lng: quest.lng, questType: quest.questType}
		return connection.queryAsync('INSERT INTO Quests SET ?', bufferQuest).then(resolve);
	});
}

// adds a character the db
var createCharacter = function(character) {
	character.level = 1;
	character.experience = 0;
	return new Promise(function(resolve, reject) {
		return connection.queryAsync('INSERT INTO Characters SET ?', character).then(resolve).catch(reject);
	});
}

// gets a quest
var getQuest = function(questId) {
	return new Promise(function(resolve, reject) {
		return connection.queryAsync('SELECT * FROM Quests WHERE id = ' + questId).then(function(quest) { 
			return resolve(quest);
		}).catch(reject);
	});
}

// gets all quests
var getAllQuests = function(characterId) {
	return new Promise(function(resolve, reject) {
		return connection.queryAsync('SELECT q.id, q.experience, q.name, q.creator_id, q.lat, q.lng, q.questType, c.active FROM Quests q LEFT OUTER JOIN CharacterQuests c ON (q.id = c.quest_id AND c.character_id = ' + characterId + ') WHERE q.complete = FALSE').then(function(result) {
			return resolve(result);
		}).catch(reject);
	});
}

// gets a character
var getCharacter = function(id) {
	return new Promise(function(resolve, reject) {
		return connection.queryAsync('SELECT * FROM Characters WHERE user_id = \"' + id + '\"').then(function(result) {
			return resolve(result);
		}).catch(reject); 
	});
}

// updates a character
var updateCharacter = function(character) {
	return new Promise(function(resolve, reject) {
		return connection.queryAsync('UPDATE Characters SET experience = ' + character.experience + ' level = ' + character.level + 'WHERE id = ' + character.id).then(resolve).catch(reject);
	});
}

// completes a quest
var completeQuest = function(characterId, questId) {
	return new Promise(function(resolve, reject) {
		return connection.queryAsync('UPDATE Quests SET complete = ' + characterId + ' WHERE id = ' + questId).then(function() {
			connection.queryAsync('DELETE FROM CharacterQuests WHERE quest_id = ' + questId).then(resolve);
		}).catch(reject);
	});
}

// activates a quest in the CharacterQuests table
var activateQuest = function(characterId, questId) {
	return new Promise(function(resolve, reject) {
		return connection.queryAsync('INSERT INTO CharacterQuests SET ?' + {character_id: characterId, quest_id: questId}).then(resolve).catch(reject);
	});
}

// deactivates a quest in the CharacterQuests table
var deactivateQuest = function(characterId, questId) {
	return new Promise(function(resolve, reject) {
		return connection.queryAsync('DELETE FROM CharacterQuests WHERE character_id = ' + characterId + 'AND quest_id = ' + questId).then(resolve).catch(reject);
	});
}

exports.connection = connection;

exports.addQuest = addQuest;
exports.addFetchQuest = addFetchQuest;
exports.createCharacter =createCharacter;
exports.getQuest = getQuest;
exports.getAllQuests = getAllQuests;
exports.getCharacter = getCharacter;
exports.updateCharacter = updateCharacter;
exports.completeQuest = completeQuest;
exports.activateQuest = activateQuest;
exports.deactivateQuest = deactivateQuest;