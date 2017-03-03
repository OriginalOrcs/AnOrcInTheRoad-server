DROP DATABASE IF EXISTS `Orc`;

CREATE DATABASE `Orc`;

USE `Orc`;

DROP TABLE IF EXISTS `Characters`;
    
CREATE TABLE `Characters` (
  `id` INTEGER AUTO_INCREMENT,
  `name` VARCHAR(20) NULL DEFAULT NULL,
  `level` INTEGER NULL DEFAULT NULL,
  `experience` INTEGER NULL DEFAULT NULL,
  `user_id` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `Quests`;
    
CREATE TABLE `Quests` (
  `id` INTEGER AUTO_INCREMENT,
  -- `item_id` INTEGER NULL DEFAULT NULL,
  `experience` INTEGER NULL DEFAULT NULL,
  `name` VARCHAR(20) NULL DEFAULT NULL,
  `creator_id` INTEGER NULL DEFAULT NULL,
  `lat` DECIMAL(11,8) NULL DEFAULT NULL,
  `lng` DECIMAL(11,8) NULL DEFAULT NULL,
  `complete` CHAR(6) NULL DEFAULT FALSE,
  `questType` VARCHAR(20) NULL DEFAULT 'addFetchQuest',
  PRIMARY KEY (`id`)
);
-- DROP TABLE IF EXISTS `Items`;
    
-- CREATE TABLE `Items` (
--   `id` INTEGER AUTO_INCREMENT,
--   `user_id` INTEGER NULL DEFAULT NULL,
--   `name` VARCHAR(20) NULL DEFAULT NULL,
--   `attack` INTEGER NULL DEFAULT NULL,
--   `defense` INTEGER NULL DEFAULT NULL,
--   PRIMARY KEY (`id`)
-- );

DROP TABLE IF EXISTS `CharacterQuests`;
    
CREATE TABLE `CharacterQuests` (
  `id` INTEGER AUTO_INCREMENT,
  `character_id` INTEGER NULL DEFAULT NULL,
  `quest_id` INTEGER NULL DEFAULT NULL,
  `active` CHAR(6) NULL DEFAULT TRUE,
  PRIMARY KEY (`id`)
);

-- ALTER TABLE `Quests` ADD FOREIGN KEY (item_id) REFERENCES `Items` (`id`);
ALTER TABLE `Quests` ADD FOREIGN KEY (creator_id) REFERENCES `Characters` (`id`);
-- ALTER TABLE `Items` ADD FOREIGN KEY (character_id) REFERENCES `Characters` (`id`);
ALTER TABLE `CharacterQuests` ADD FOREIGN KEY (character_id) REFERENCES `Characters` (`id`);
ALTER TABLE `CharacterQuests` ADD FOREIGN KEY (quest_id) REFERENCES `Quests` (`id`);


INSERT INTO `Characters` (`name`,`level`,`experience`,`user_id`) VALUES ('Aldric Testmane', 9001, 42, 'test');
INSERT INTO `Characters` (`name`,`level`,`experience`) VALUES ('Testalia Greybeard', 9001, 42);
INSERT INTO `Quests` (`name`,`experience`,`creator_id`,`lat`,`lng`) VALUES ('testQuest', 100, 1, 100, 100);
INSERT INTO `Quests` (`name`,`experience`,`creator_id`,`lat`,`lng`) VALUES ('secondCharTestQuest', 100, 2, 100, 100);
INSERT INTO `Quests` (`name`,`experience`,`creator_id`,`lat`,`lng`) VALUES ('anotherTestQuest', 100, 1, 100, 100);
INSERT INTO `Quests` (`name`,`experience`,`creator_id`,`lat`,`lng`,`complete`) VALUES ('completedTestQuest', 100, 1, 100, 100,TRUE);