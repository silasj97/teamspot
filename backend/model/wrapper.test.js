"use strict";

const mysql = require("mysql");
const bcrypt = require("bcrypt");

const config = require("../config");
const sqlwrapper = require("./wrapper");
const connection = require("./connect");

const databaseConfig = {
  host: config.databaseConfig.host,
  username: config.databaseConfig.username,
  password: config.databaseConfig.password,
  schema: "tempwrapperjestschema"
};

let dc;

async function setupTemporarySchema(host, username, password, temporarySchema) {
  const c = mysql.createConnection({
    host: host,
    user: username,
    password: password
  });
  c.connect();
  const setupSchemaQuery = "CREATE SCHEMA " + temporarySchema + ";";
  await sqlwrapper.executeSQL(c, setupSchemaQuery, []);
  c.destroy();
  const specC = mysql.createConnection({
    host: host,
    user: username,
    password: password,
    database: temporarySchema
  });
  specC.connect();
  const setupUsersTableQuery = `CREATE TABLE users (
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        userName VARCHAR(60),
        admin BOOL DEFAULT FALSE NOT NULL,
        PRIMARY KEY(email)
    );`;
  await sqlwrapper.executeSQL(specC, setupUsersTableQuery, []);
  const setupTournamentsTableQuery = `CREATE TABLE tournaments (
    id INT(10) NOT NULL UNIQUE AUTO_INCREMENT,
      creator VARCHAR(255) NOT NULL,
      description VARCHAR(255) DEFAULT NULL,
      maxTeamSize INT(5) NOT NULL DEFAULT 1,
      location VARCHAR(255) DEFAULT NULL,
      scoringType ENUM('Points') NOT NULL DEFAULT 'Points',
      tournamentName VARCHAR(255) DEFAULT NULL,
      tournamentType ENUM('Single Elim', 'Double Elim', 'Round-robin') NOT NULL DEFAULT 'Single Elim',
      entryCost INT(5) NOT NULL DEFAULT 0,
      maxTeams INT(5) NOT NULL DEFAULT 16,
      startDate DATE DEFAULT NULL,
      endDate DATE DEFAULT NULL,
      PRIMARY KEY(id),
      FOREIGN KEY(creator)
      REFERENCES users(email)
  );`;
  await sqlwrapper.executeSQL(specC, setupTournamentsTableQuery, []);
  const setupTeamsTableQuery = `CREATE TABLE teams (
    id INT(12) NOT NULL UNIQUE AUTO_INCREMENT,
      teamName VARCHAR(255),
      leader VARCHAR(255) NOT NULL,
      tournament INT(10) NOT NULL,
      paid BOOL DEFAULT FALSE NOT NULL,
      seed INT(4) DEFAULT NULL,
      PRIMARY KEY(id),
      FOREIGN KEY(leader)
      REFERENCES users(email),
      FOREIGN KEY(tournament)
      REFERENCES tournaments(id)
  );`;
  await sqlwrapper.executeSQL(specC, setupTeamsTableQuery, []);
  const setupMatchesTableQuery = `CREATE TABLE matches (
    id INT(12) NOT NULL UNIQUE AUTO_INCREMENT,
      location VARCHAR(255) DEFAULT NULL,
      winner INT(1) DEFAULT 0,
      matchTime DATETIME DEFAULT NULL,
      matchName VARCHAR(255) DEFAULT NULL,
      tournament INT(10) NOT NULL,
      teamA INT(12) NOT NULL,
      teamB INT(12) NOT NULL,
      feederA INT(12),
      feederB INT(12),
      scoreA INT(12),
      scoreB INT(12),
      feederAIsLoser BOOL DEFAULT FALSE,
      feederBIsLoser BOOL DEFAULT FALSE,
      PRIMARY KEY(id),
      FOREIGN KEY(tournament)
      REFERENCES tournaments(id),
      FOREIGN KEY(teamA)
      REFERENCES teams(id),
      FOREIGN KEY(teamB)
      REFERENCES teams(id)
  );`;
  await sqlwrapper.executeSQL(specC, setupMatchesTableQuery, []);
  const setupTeamMembersTableQuery = `CREATE TABLE teamMembers (
    userEmail VARCHAR(255) NOT NULL,
      teamId INT(12) NOT NULL,
      invited BOOL DEFAULT FALSE NOT NULL,
      requested BOOL DEFAULT FALSE NOT NULL,
      approved BOOL DEFAULT FALSE NOT NULL,
    PRIMARY KEY(userEmail, teamId),
      FOREIGN KEY(userEmail)
      REFERENCES users(email),
      FOREIGN KEY(teamId)
      REFERENCES teams(id)
  );`;
  await sqlwrapper.executeSQL(specC, setupTeamMembersTableQuery, []);
  const setupRefereeTableQuery = `CREATE TABLE referees (
    userEmail VARCHAR(255) NOT NULL,
      tournamentId INT(12) NOT NULL,
      FOREIGN KEY(userEmail)
      REFERENCES users(email),
      FOREIGN KEY(tournamentId)
      REFERENCES tournaments(id),
      PRIMARY KEY(userEmail, tournamentId)
  );`;
  await sqlwrapper.executeSQL(specC, setupRefereeTableQuery, []);
  const setupExampleUserQuery =
    "INSERT INTO users(email, password, username, admin) VALUES (?, ?, ?, false);";
  await sqlwrapper.executeSQL(specC, setupExampleUserQuery, [
    "example@example.com",
    await bcrypt.hash("example", 10),
    "example"
  ]);
  const setupExampleTournamentQuery =
    "INSERT INTO tournaments (creator, tournamentName, startDate, endDate) VALUES (?, ?, ?, ?)";
  await sqlwrapper.executeSQL(specC, setupExampleTournamentQuery, [
    "example@example.com",
    "test tournament",
    "9999-01-01",
    "9999-01-02"
  ]);
  specC.destroy();
  dc = connection.connect(
    databaseConfig.host,
    databaseConfig.username,
    databaseConfig.password,
    databaseConfig.schema
  );
}

async function cleanupTemporarySchema(
  host,
  username,
  password,
  temporarySchema
) {
  const c = mysql.createConnection({
    host: host,
    user: username,
    password: password
  });
  c.connect();
  const setupSchemaQuery = "DROP SCHEMA " + temporarySchema + ";";
  await sqlwrapper.executeSQL(c, setupSchemaQuery, []);
  c.destroy();
  dc.destroy();
}

describe("sql wrapper", () => {
  beforeAll(async () => {
    await setupTemporarySchema(
      databaseConfig.host,
      databaseConfig.username,
      databaseConfig.password,
      databaseConfig.schema
    );
  });

  afterAll(async () => {
    await cleanupTemporarySchema(
      databaseConfig.host,
      databaseConfig.username,
      databaseConfig.password,
      databaseConfig.schema
    );
  });

  test("Execute SQL", async done => {
    const testQuery = "SELECT * FROM users;";
    const c = dc;
    const result = await sqlwrapper.executeSQL(c, testQuery, []);
    if (!result) {
      throw new Error("Something went wrong.");
    }
    if (result.length !== 1) {
      throw new Error(
        "Row count not 1 as expected, got " + result.length.toString()
      );
    }
    done();
  });

  test("Create user", async done => {
    const testGetUsers = "SELECT * FROM users WHERE email = ?;";
    const testUserName = "Test Create User";
    const testUserEmail = "testCreateUser@gatech.edu";
    const testUserPassword = "testcreateuserpassword";
    const c = dc;
    await sqlwrapper.createUser(
      c,
      testUserName,
      testUserEmail,
      testUserPassword,
      0
    );
    const result = await sqlwrapper.executeSQL(c, testGetUsers, [
      testUserEmail
    ]);
    if (!result) {
      throw new Error("Something went wrong.");
    }
    if (result.length !== 1) {
      throw new Error(
        "Row count not 1 as expected, got " + result.length.toString()
      );
    }
    const email = result[0].email;
    const password = result[0].password;
    const name = result[0].userName;
    if (email !== testUserEmail) {
      throw new Error(
        "Email is not as expected, should be: " +
          testUserEmail +
          ", instead got: " +
          email
      );
    }
    if (name !== testUserName) {
      throw new Error(
        "Name is not as expected, should be: " +
          testUserName +
          ", instead got: " +
          name
      );
    }
    const correctPassword = await bcrypt.compare(testUserPassword, password);
    if (!correctPassword) {
      throw new Error("Password match failed.");
    }
    done();
  });

  test("User Exists", async done => {
    const testUserEmail = "testUserExists@gatech.edu";
    const testUserName = "Test User Exists";
    const testUserPassword = "testuserexistspassword";
    const insertUserQuery =
      "INSERT INTO users(email, password, username, admin) VALUES (?, ?, ?, false);";
    const c = dc;
    await sqlwrapper.executeSQL(c, insertUserQuery, [
      testUserEmail,
      testUserPassword,
      testUserName
    ]);
    const exists = await sqlwrapper.userExists(c, testUserEmail);
    if (!exists) {
      throw new Error(
        "Expected for user to exist, instead got user does not exist."
      );
    }
    done();
  });

  test("Check Valid Credentials", async done => {
    const saltrounds = 10;
    const testUserEmail = "testCheckValidCredentials@gatech.edu";
    const testUserName = "Test Check Valid Credentials";
    const testUserPassword = "testcheckvalidcredentialspassword";
    const testUserHashedPassword = await bcrypt.hash(
      testUserPassword,
      saltrounds
    );
    const insertUserQuery =
      "INSERT INTO users(email, password, username, admin) VALUES (?, ?, ?, false);";
    const c = dc;
    await sqlwrapper.executeSQL(c, insertUserQuery, [
      testUserEmail,
      testUserHashedPassword,
      testUserName
    ]);
    const validCredentials = await sqlwrapper.checkCredentials(
      c,
      testUserEmail,
      testUserPassword
    );
    if (!validCredentials) {
      throw new Error(
        "Expected valid credentials, instead got invalid credentials."
      );
    }
    done();
  });

  test("Check Invalid Credentials", async done => {
    const saltrounds = 10;
    const testUserEmail = "testCheckInvalidCredentials@gatech.edu";
    const testUserName = "Test Check Invalid Credentials";
    const testUserPassword = "testcheckinvalidcredentialspassword";
    const testUserHashedPassword = await bcrypt.hash(
      testUserPassword,
      saltrounds
    );
    const insertUserQuery =
      "INSERT INTO users(email, password, username, admin) VALUES (?, ?, ?, false);";
    const c = dc;
    await sqlwrapper.executeSQL(c, insertUserQuery, [
      testUserEmail,
      testUserHashedPassword,
      testUserName
    ]);
    const validCredentials = await sqlwrapper.checkCredentials(
      c,
      testUserEmail,
      "invalid credentials"
    );
    if (validCredentials) {
      throw new Error(
        "Expected invalid credentials, instead got valid credentials."
      );
    }
    done();
  });

  test("Create Tournament", async done => {
    // This test requires the create user to test to pass as tournaments needs it as a foreign key
    const c = dc;
    const testUserEmail = "example@example.com";
    const testTournamentName = "tournament test";
    const getTestTournament =
      "SELECT * FROM tournaments WHERE tournamentName = ?;";
    await sqlwrapper.createTournament(
      c,
      testUserEmail,
      testTournamentName,
      testTournamentName,
      16,
      "CULC",
      "Points",
      "Single Elim",
      0,
      16,
      "9999-01-01",
      "9999-01-02"
    );
    const result = await sqlwrapper.executeSQL(c, getTestTournament, [
      testTournamentName
    ]);
    if (result.length < 1) {
      throw new Error("Did not find tournament in table upon searching.");
    }
    done();
  });

  test("Search/Get Tournament", async done => {
    const c = dc;
    const testTournamentName = "test tournament";
    const result = await sqlwrapper.searchTournament(c, testTournamentName);
    if (result.length < 1) {
      throw new Error("Did not find tournament in table upon searching.");
    }
    const testId = result[0].id;
    const name = result[0].tournamentName;
    const exists = await sqlwrapper.getTournament(c, testId);
    if (exists.length < 1) {
      throw new Error("Expected for tournament to be returned.");
    }
    if (name !== testTournamentName) {
      throw new Error("Name field does not match.");
    }
    done();
  });

  test("Create Team", async done => {
    const c = dc;
    const testTournamentName = "test tournament";
    const testUserEmail = "example@example.com";
    const result = await sqlwrapper.searchTournament(c, testTournamentName);
    if (result.length < 1) {
      throw new Error("Did not find tournament in table upon searching.");
    }
    const testId = result[0].id;
    const teamName = "test team";
    await sqlwrapper.createTeam(
      c,
      teamName,
      testUserEmail,
      testId,
      false,
      null
    );
    const getTestTeam = "SELECT * FROM teams WHERE teamName = ?;";
    const result1 = await sqlwrapper.executeSQL(c, getTestTeam, [teamName]);
    if (result1.length < 1) {
      throw new Error("Did not find team in table upon searching.");
    }
    done();
  });

  test("Add Member", async done => {
    const c = dc;
    const testUserEmail = "testUserExists@gatech.edu";
    const teamName = "test team";
    const getTestTeam = "SELECT * FROM teams WHERE teamName = ?;";
    const result1 = await sqlwrapper.executeSQL(c, getTestTeam, [teamName]);
    if (result1.length < 1) {
      throw new Error("Did not find team in table upon searching.");
    }
    const teamId = result1[0].id;
    await sqlwrapper.createTeamMember(
      c,
      testUserEmail,
      teamId,
      true,
      true,
      true
    );
    const getTestTeamMembers = "SELECT * FROM teamMembers WHERE teamId = ?;";
    const result2 = await sqlwrapper.executeSQL(c, getTestTeamMembers, [
      teamId
    ]);
    if (result2.length < 1) {
      throw new Error("Did not find team member in table upon searching.");
    }
    done();
  });

  test("Get Team/Create Match", async done => {
    const c = dc;
    const testTournamentName = "test tournament";
    const result = await sqlwrapper.searchTournament(c, testTournamentName);
    if (result.length < 1) {
      throw new Error("Did not find tournament in table upon searching.");
    }
    const testId = result[0].id;
    const result1 = await sqlwrapper.getTeams(c, testId);
    if (result1.length < 1) {
      throw new Error("Did not find team in table upon searching.");
    }
    const teamId = result[0].id;
    await sqlwrapper.createMatch(
      c,
      null,
      null,
      null,
      null,
      testId,
      teamId,
      teamId,
      null,
      null,
      null,
      null,
      false,
      false
    );
    const getTestMatch = "SELECT * FROM matches WHERE tournament = ?;";
    const result2 = await sqlwrapper.executeSQL(c, getTestMatch, [testId]);
    if (result2.length < 1) {
      throw new Error("Did not find match in table upon searching.");
    }
    done();
  });

  test("Delete Match", async done => {
    const c = dc;
    const testTournamentName = "test tournament";
    const result = await sqlwrapper.searchTournament(c, testTournamentName);
    if (result.length < 1) {
      throw new Error("Did not find tournament in table upon searching.");
    }
    const testId = result[0].id;
    await sqlwrapper.deleteMatch(c, 1);
    const getTestMatch = "SELECT * FROM matches WHERE tournament = ?;";
    const result1 = await sqlwrapper.executeSQL(c, getTestMatch, [testId]);
    if (result1.length > 1) {
      throw new Error("Match deletion failed?");
    }
    done();
  });

  test("Delete Team Member", async done => {
    const c = dc;
    const testUserEmail = "testUserExists@gatech.edu";
    const teamName = "test team";
    const getTestTeam = "SELECT * FROM teams WHERE teamName = ?;";
    const result1 = await sqlwrapper.executeSQL(c, getTestTeam, [teamName]);
    if (result1.length < 1) {
      throw new Error("Did not find team in table upon searching.");
    }
    const teamId = result1[0].id;
    await sqlwrapper.deleteTeamMember(c, testUserEmail, teamId);
    const getTestTeamMembers = "SELECT * FROM teamMembers WHERE userEmail = ?;";
    const result2 = await sqlwrapper.executeSQL(c, getTestTeamMembers, [
      testUserEmail
    ]);
    if (result2.length > 1) {
      throw new Error("Team member deletion failed?");
    }
    done();
  });

  test("Delete Team", async done => {
    const c = dc;
    const testTournamentName = "test tournament";
    const result = await sqlwrapper.searchTournament(c, testTournamentName);
    if (result.length < 1) {
      throw new Error("Did not find tournament in table upon searching.");
    }
    const testId = result[0].id;
    await sqlwrapper.deleteTeam(c, 1);
    const getTestTeam = "SELECT * FROM teams WHERE tournament = ?;";
    const result1 = await sqlwrapper.executeSQL(c, getTestTeam, [testId]);
    if (result1.length > 1) {
      throw new Error("Team deletion failed?");
    }
    done();
  });

  test("Delete Tournament", async done => {
    const c = dc;
    const testTournamentName = "test tournament";
    const result = await sqlwrapper.searchTournament(c, testTournamentName);
    if (result.length < 1) {
      throw new Error("Did not find tournament in table upon searching.");
    }
    const testId = result[0].id;
    await sqlwrapper.deleteTournament(c, testId);
    const exists = await sqlwrapper.searchTournament(c, testTournamentName);
    if (exists.length > 1) {
      throw new Error("Tournament deletion failed?");
    }
    done();
  });
});
