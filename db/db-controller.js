var Promise = require('bluebird');
var mysql = require('mysql');

var connection = mysql.createConnection({
  host: "localhost",
  database: "Orc",
  user: "root",
  password: ""
});

connection = Promise.promisifyAll(connection);

connection.connectAsync().then(function() {
	exports.addQuest({type: 'addFetchQuest'})
});

var addQuest = Promise.promisify(function(quest, callback) {
	return this[quest.type](quest).then(function(err, result) {
		if (err) {
			callback(err);
		}
		callback(null, result);
	});
});

var addFetchQuest = Promise.promisify(function(quest, callback) {
	quest = { name: quest.name, creator_id: quest.creator_id, experience: quest.experience, lat: quest.lat, lng: quest.lng}
	connection.queryAsync('INSERT INTO Quests SET ?', quest).then(function(result) {
		console.log('DID it')
	});
});


exports.addFetchQuest = addFetchQuest;
exports.addQuest = addQuest;