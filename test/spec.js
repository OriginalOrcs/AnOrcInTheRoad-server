var chai = require('chai');
var expect = chai.expect;

var db = require('../db/db-controller');

describe('An Orc in The Road', function() {

	describe('Database - MySQL', function() {

		describe('Quests', function() {

			it('should add fetch quests to db', function(done) {
				var quest = {name: 'testQuest2', type: 'addFetchQuest', creator_id: 1, experience: 100, lat: 100, lng: 100};
				db.addFetchQuest(quest).then(function() {
					db.connection.queryAsync('SELECT name FROM Quests WHERE name = "testQuest"').then(function(result) {
						expect(result[result.length - 1].name).to.exist;
						done();
					});
				});
			});

			it('should get all quests', function(done) {
				var quest = {name: 'testQuest3', type: 'addFetchQuest', creator_id: 1, experience: 100, lat: 100, lng: 100};
				db.addFetchQuest(quest).then(function() {
					db.getAllQuests(2).then(function(result) {
						expect(!!result[result.length - 1].name).to.equal(true);
						done();
					});
				});
			});

			it('should complete a quest by id', function(done) {
				db.completeQuest(1, 1).then(function(result) {
					db.connection.queryAsync('SELECT complete FROM Quests WHERE id = 1').then(function(result) {
						expect(!!result[0].complete).to.equal(true);
						done()
					})
				});
			});

		});

		describe('Characters', function() {
			
			it('should get a character by id', function(done) {
				db.getCharacter('test').then(function(result) {
					console.log(result)
					expect(result[0].name).to.equal('Aldric Testmane');
					done();
				});
			});

		});


	});	
});