CREATE TABLE `datatagger`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `password` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE `datatagger`.`image` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `taskname` VARCHAR(100) NOT NULL,
  `userid` INT NOT NULL,
  `username` VARCHAR(50) NOT NULL,  
  `receiveuserid` INT NULL,
  `receiveusername` VARCHAR(50) NOT NULL,
  `description` VARCHAR(256) NOT NULL,
  `datetime` DATETIME NOT NULL,
  `status` INT NOT NULL,
  `image1` VARCHAR(200) NOT NULL,
  `image2` VARCHAR(200) NOT NULL,
  `image3` VARCHAR(200) NOT NULL,
  `image4` VARCHAR(200) NOT NULL,
  `image5` VARCHAR(200) NOT NULL,
  `image6` VARCHAR(200) NOT NULL,
  `image7` VARCHAR(200) NOT NULL,
  `image8` VARCHAR(200) NOT NULL,
  `image9` VARCHAR(200) NOT NULL, 
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8；

INSERT INTO `user` VALUES(null, 'admin', 'admin', '3190300677@zju.edu.cn', '19817865057');
