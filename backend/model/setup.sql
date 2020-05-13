CREATE SCHEMA tournamentbuzz;
USE tournamentbuzz;

CREATE TABLE users (
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255),
  userName VARCHAR(60),
  usesGoogleAuth BIT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY(email)
);

CREATE TABLE tournaments (
	id INT(10) NOT NULL UNIQUE AUTO_INCREMENT,
    creator VARCHAR(255) NOT NULL,
    description VARCHAR(255) DEFAULT NULL,
    maxTeamSize INT(5) NOT NULL DEFAULT 1,
    location VARCHAR(255) DEFAULT NULL,
    scoringType ENUM('Points') NOT NULL DEFAULT 'Points',
    tournamentName VARCHAR(255) DEFAULT NULL,
    tournamentType ENUM('Single Elim', 'Double Elim', 'Round-robin', 'Custom') NOT NULL DEFAULT 'Single Elim',
    entryCost INT(5) NOT NULL DEFAULT 0,
    maxTeams INT(5) NOT NULL DEFAULT 16,
    startDate DATE DEFAULT NULL,
    endDate DATE DEFAULT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(creator)
		REFERENCES users(email)
        ON DELETE CASCADE
);

CREATE TABLE teams (
	id INT(12) NOT NULL UNIQUE AUTO_INCREMENT,
    teamName VARCHAR(255) DEFAULT NULL,
    leader VARCHAR(255) NOT NULL,
    tournament INT(10) NOT NULL,
    paid BOOL DEFAULT FALSE NOT NULL,
    seed INT(4) DEFAULT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(leader)
		REFERENCES users(email)
        ON DELETE CASCADE,
    FOREIGN KEY(tournament)
		REFERENCES tournaments(id)
		ON DELETE CASCADE
);

CREATE TABLE matches (
	id INT(12) NOT NULL UNIQUE AUTO_INCREMENT,
    location VARCHAR(255) DEFAULT NULL,
    winner INT(1) DEFAULT 0,
    matchTime DATETIME DEFAULT NULL,
    matchName VARCHAR(255) DEFAULT NULL,
    tournament INT(10) NOT NULL,
    teamA INT(12) DEFAULT NULL,
    teamB INT(12) DEFAULT NULL,
    publish BOOL DEFAULT FALSE NOT NULL,
    feederA INT(12) DEFAULT NULL,
    feederB INT(12) DEFAULT NULL,
    scoreA INT(10) DEFAULT NULL,
    scoreB INT(10) DEFAULT NULL,
    feederAIsLoser BOOL DEFAULT FALSE,
    feederBIsLoser BOOL DEFAULT FALSE,
    PRIMARY KEY(id),
    FOREIGN KEY(tournament)
		REFERENCES tournaments(id)
		ON DELETE CASCADE,
    FOREIGN KEY(teamA)
		REFERENCES teams(id)
        ON DELETE SET NULL,
    FOREIGN KEY(teamB)
		REFERENCES teams(id)
        ON DELETE SET NULL
);

CREATE TABLE teamMembers (
	userEmail VARCHAR(255) NOT NULL,
    teamId INT(12) NOT NULL,
    invited BOOL DEFAULT FALSE NOT NULL,
    requested BOOL DEFAULT FALSE NOT NULL,
    approved BOOL DEFAULT FALSE NOT NULL,
	PRIMARY KEY(userEmail, teamId),
    FOREIGN KEY(userEmail)
		REFERENCES users(email)
		ON DELETE CASCADE,
    FOREIGN KEY(teamId)
		REFERENCES teams(id)
        ON DELETE CASCADE
);

CREATE TABLE referees (
	userEmail VARCHAR(255) NOT NULL,
    tournamentId INT(12) NOT NULL,
    FOREIGN KEY(userEmail)
		REFERENCES users(email)
		ON DELETE CASCADE,
    FOREIGN KEY(tournamentId)
		REFERENCES tournaments(id)
		ON DELETE CASCADE,
    PRIMARY KEY(userEmail, tournamentId)
);

