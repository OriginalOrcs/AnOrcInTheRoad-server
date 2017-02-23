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
  password: "originalorcs"
});

connection = Promise.promisifyAll(connection);

connection.connect();

var addQuest = function(quest) {
	var that = this;
	return new Promise((resolve, reject) => {
		return that[quest.type](quest).then(resolve);
	});
} 

var addFetchQuest = function(quest) {
	return new Promise(function(resolve, reject) {
		var bufferQuest = { name: quest.name, creator_id: quest.creator_id, experience: quest.experience, lat: quest.lat, lng: quest.lng}
		return connection.queryAsync('INSERT INTO Quests SET ?', bufferQuest).then(function(result) {
			return getAllQuests().then(resolve);
		});
	});
}

var createCharacter = function(character) {
	return new Promise(function(resolve, reject) {
		return connection.queryAsync('INSERT INTO Characters SET ?', character).then(resolve).catch(reject);
	});
}

var getAllQuests = function(userId) {
	return new Promise(function(resolve, reject) {
		return connection.queryAsync('SELECT q.id, q.experience, q.name, q.creator_id, q.lat, q.lng, c.active FROM Quests q LEFT OUTER JOIN CharacterQuests c ON (q.id = c.quest_id AND c.user_id = ' + userId +') WHERE q.complete = FALSE').then(function(result) {
			return resolve(result);
		}).catch(reject);
	});
}

var getCharacter = function(id) {
	return new Promise(function(resolve, reject) {
		return connection.queryAsync('SELECT * FROM Characters WHERE id = ' + id).then(function(result) {
			return resolve(result);
		}).catch(reject); 
	});
}

var completeQuest = function(userId, questId) {
	return new Promise(function(resolve, reject) {
		return connection.queryAsync('UPDATE Quests SET complete = ' + userId + ' WHERE id = ' + questId).then(function() {
			connection.queryAsync('DELETE FROM CharacterQuests WHERE user_id = ' + userId + 'AND quest_id = ' + questId).then(resolve);
		}).catch(reject);
	});
}

var activateQuest = function(userId, questId) {
	return new Promise(function(resolve, reject) {
		return connection.queryAsync('INSERT INTO CharacterQuests SET ?' + {user_id: userId, quest_id: questId}).then(resolve).catch(reject);
	});
}

var deactivateQuest = function(userId, questId) {
	return new Promise(function(resolve, reject) {
		return connection.queryAsync('DELETE FROM CharacterQuests WHERE user_id = ' + userId + 'AND quest_id = ' + questId).then(resolve).catch(reject);
	});
}

exports.connection = connection;

exports.addFetchQuest = addFetchQuest;
exports.addQuest = addQuest;
exports.getAllQuests = getAllQuests;
exports.getCharacter = getCharacter;
exports.completeQuest = completeQuest;