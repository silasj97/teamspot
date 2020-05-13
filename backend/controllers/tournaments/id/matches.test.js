"use strict";

const request = require("supertest");
const express = require("express");
const mysql = require("mysql");

const config = require("../../../config");
const sqlwrapper = require("../../../model/wrapper");
const connection = require("../../../model/connect");
const matches = require("./matches");

const app = express();
app.use(express.json());
const databaseConfig = {
  host: config.databaseConfig.host,
  username: config.databaseConfig.username,
  password: config.databaseConfig.password,
  schema: "tempmatchesjestschema"
};
const authConfig = { authKey: "matchesTestSecret", expiresIn: "1s" };
app.set("authConfig", authConfig);
app.set("serverConfig", config.serverConfig);
app.set("databaseConfig", databaseConfig);

function mockErrorHandler(err, req, res, next) {
  if (err && err.status) {
    res.status(err.status);
    res.json({ status: err.status, message: err.message });
  } else {
    res.status(500);
    res.json({ status: 500, message: "something unexpected happened" });
  }
}

app.use("/matches", matches);
app.use(mockErrorHandler);

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
      PRIMARY KEY(id)
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
    teamA INT(12) DEFAULT NULL,
    teamB INT(12) DEFAULT NULL,
    feederA INT(12),
    feederB INT(12),
    scoreA INT(12),
    scoreB INT(12),
    feederAIsLoser BOOL DEFAULT FALSE,
    feederBIsLoser BOOL DEFAULT FALSE,
    publish BOOL DEFAULT FALSE NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(tournament)
    REFERENCES tournaments(id),
    FOREIGN KEY(teamA)
    REFERENCES teams(id),
    FOREIGN KEY(teamB)
    REFERENCES teams(id)
  );`;
  await sqlwrapper.executeSQL(specC, setupMatchesTableQuery, []);
  const setupExampleTournamentQuery =
    "INSERT INTO tournaments (creator, tournamentName, startDate, endDate) VALUES (?, ?, ?, ?)";
  await sqlwrapper.executeSQL(specC, setupExampleTournamentQuery, [
    "example@example.com",
    "test tournament",
    "9999-01-01",
    "9999-01-02"
  ]);
  await sqlwrapper.executeSQL(specC, setupExampleTournamentQuery, [
    "example@example.com",
    "test tournament 2",
    "9999-01-01",
    "9999-01-02"
  ]);
  await sqlwrapper.createTeam(specC, "oof", "example@example.com", 2);
  await sqlwrapper.createTeam(
    specC,
    "dennis why did you remove foreign keys",
    "example@example.com",
    2
  );
  specC.destroy();
  app.set(
    "databaseConnection",
    connection.connect(
      app.get("databaseConfig").host,
      app.get("databaseConfig").username,
      app.get("databaseConfig").password,
      app.get("databaseConfig").schema
    )
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
  app.get("databaseConnection").destroy();
}

describe("matches", () => {
  const temporarySchema = "tempmatchesjestschema";
  const tournament1 = 1;
  const tournament2 = 2;
  const loc1 = "location test";
  const loc2 = "CULC";
  const loc3 = "Russia";
  const teamA = 1;
  const teamB = 2;
  const testMatchName1 = "Test Match";
  const testMatchName2 = "A vs B";
  const testMatchName3 = "D vs C";
  const testT1DateTime = "2018-01-20 10:00:00";
  const testT2DateTime = "2018-01-20 13:30:00";
  const testT3DateTime = "2018-01-01 09:15:00";
  const t2Date = new Date("2018-01-20 13:30:00 UTC");
  const t3Date = new Date("2018-01-01 09:15:00 UTC");
  const tt2Date = t2Date.toISOString();
  const tt3Date = t3Date.toISOString();

  beforeAll(async done => {
    await setupTemporarySchema(
      databaseConfig.host,
      databaseConfig.username,
      databaseConfig.password,
      temporarySchema
    ).catch(function(err) {
      throw new Error("Unable to create temporary schema: " + err.message);
    });
    const c = app.get("databaseConnection");
    await sqlwrapper
      .createMatch(
        c,
        loc1,
        null,
        testT1DateTime,
        testMatchName1,
        tournament1,
        null,
        null,
        null,
        null,
        null,
        null,
        false,
        false
      )
      .catch(function(err) {
        throw new Error("Unable to create match: " + err.message);
      });
    await sqlwrapper
      .createMatch(
        c,
        loc2,
        null,
        testT2DateTime,
        testMatchName2,
        tournament2,
        null,
        null,
        null,
        null,
        null,
        null,
        false,
        false
      )
      .catch(function(err) {
        throw new Error("Unable to create match: " + err.message);
      });
    await sqlwrapper
      .createMatch(
        c,
        loc3,
        null,
        testT3DateTime,
        testMatchName3,
        tournament2,
        teamA,
        teamB,
        null,
        null,
        null,
        null,
        false,
        false
      )
      .catch(function(err) {
        throw new Error("Unable to create match: " + err.message);
      });
    done();
  });

  afterAll(async done => {
    await cleanupTemporarySchema(
      databaseConfig.host,
      databaseConfig.username,
      databaseConfig.password,
      temporarySchema
    ).catch(function(err) {
      throw new Error("Unable to cleanup temporary schema: " + err.message);
    });
    done();
  });

  test("Matches Success", async done => {
    await request(app)
      .get("/matches")
      .set("id", "example@example.com")
      .set("tournamentid", "2")
      .expect("Content-Type", /json/)
      .expect(200)
      .expect(res => {
        try {
          if (
            res.body.matches[0].location !== loc3 ||
            res.body.matches[0].matchTime !== tt3Date ||
            res.body.matches[0].matchName !== testMatchName3 ||
            res.body.matches[0].tournament !== tournament2 ||
            res.body.matches[0].teamA !== teamA ||
            res.body.matches[0].teamB !== teamB
          ) {
            throw new Error("Match fields do not match!");
          }
          if (
            res.body.matches[1].location !== loc2 ||
            res.body.matches[1].matchTime !== tt2Date ||
            res.body.matches[1].matchName !== testMatchName2 ||
            res.body.matches[1].tournament !== tournament2 ||
            res.body.matches[1].teamA !== null ||
            res.body.matches[1].teamB !== null
          ) {
            throw new Error("Match fields do not match!");
          }
          if (t2Date < t3Date) {
            throw new Error("Tournaments are not in descending order!");
          }
        } catch (e) {
          e.message =
            "Returned matches is not valid for some reason or another: " +
            e.message;
          throw e;
        }
      });
    done();
  });
});
