DROP DATABASE IF EXISTS `Orc`;

CREATE DATABASE `Orc`;

USE `Orc`;

DROP TABLE IF EXISTS `Characters`;
		
CREATE TABLE `Characters` (
  `id` INTEGER AUTO_INCREMENT,
  `name` VARCHAR(20) NULL DEFAULT NULL,
  `level` INTEGER NULL DEFAULT NULL,
  `experience` INTEGER NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `Quests`;
		
CREATE TABLE `Quests` (
  `id` INTEGER AUTO_INCREMENT,
  -- `item_id` INTEGER NULL DEFAULT NULL,
  `experience` INTEGER NULL DEFAULT NULL,
  `name` VARCHAR(20) NULL DEFAULT NULL,
  `creator_id` INTEGER NULL DEFAULT NULL,
  `lat` DECIMAL NULL DEFAULT NULL,
  `lng` DECIMAL NULL DEFAULT NULL,
  `complete` CHAR(6) NULL DEFAULT FALSE,
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
  `user_id` INTEGER NULL DEFAULT NULL,
  `quest_id` INTEGER NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- ALTER TABLE `Quests` ADD FOREIGN KEY (item_id) REFERENCES `Items` (`id`);
ALTER TABLE `Quests` ADD FOREIGN KEY (creator_id) REFERENCES `Characters` (`id`);
-- ALTER TABLE `Items` ADD FOREIGN KEY (user_id) REFERENCES `Characters` (`id`);
ALTER TABLE `CharacterQuests` ADD FOREIGN KEY (user_id) REFERENCES `Characters` (`id`);
ALTER TABLE `CharacterQuests` ADD FOREIGN KEY (quest_id) REFERENCES `Quests` (`id`);


INSERT INTO `Characters` (`name`,`level`,`experience`) VALUES ('Aldric Testman', 9001, 42);