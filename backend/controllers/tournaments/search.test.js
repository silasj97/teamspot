"use strict";

const request = require("supertest");
const express = require("express");
const mysql = require("mysql");

const config = require("../../config");
const sqlwrapper = require("../../model/wrapper");
const connection = require("../../model/connect");
const search = require("./search");

const app = express();
app.use(express.json());
const databaseConfig = {
  host: config.databaseConfig.host,
  username: config.databaseConfig.username,
  password: config.databaseConfig.password,
  schema: "temptournsearchschema"
};
const authConfig = { authKey: "loginTestSecret", expiresIn: "1s" };
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

app.use("/tournaments/search", search);
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
  const setupUsersTableQuery = `CREATE TABLE users (
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        userName VARCHAR(60),
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
  const setupMatchesTableQuery = `CREATE TABLE matches (
        id INT(12) NOT NULL UNIQUE AUTO_INCREMENT,
        location VARCHAR(255) DEFAULT NULL,
        score VARCHAR(255) DEFAULT NULL,
        matchTime DATETIME DEFAULT NULL,
        matchName VARCHAR(255) DEFAULT NULL,
        tournament INT(10) NOT NULL,
        PRIMARY KEY(id),
        FOREIGN KEY(tournament)
        REFERENCES tournaments(id)
  );`;
  await sqlwrapper.executeSQL(specC, setupMatchesTableQuery, []);
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

describe("search", () => {
  const testUserEmail = "test@gatech.edu";
  const testUserPassword = "testpassword";
  const testUserName = "Test User";
  const testTournamentName1 = "Test Tournament";
  const testTournamentName2 = "Test Tournament 2";
  beforeAll(async done => {
    await setupTemporarySchema(
      databaseConfig.host,
      databaseConfig.username,
      databaseConfig.password,
      databaseConfig.schema
    ).catch(function(err) {
      throw new Error("Unable to create temporary schema: " + err.message);
    });
    const c = app.get("databaseConnection");
    await sqlwrapper
      .createUser(c, testUserName, testUserEmail, testUserPassword, 0)
      .catch(function(err) {
        throw new Error("Unable to create user: " + err.message);
      });
    await sqlwrapper.createTournament(c, testUserEmail, testTournamentName1);
    await sqlwrapper.createTournament(c, testUserEmail, testTournamentName2);
    done();
  });

  afterAll(async done => {
    await cleanupTemporarySchema(
      databaseConfig.host,
      databaseConfig.username,
      databaseConfig.password,
      databaseConfig.schema
    ).catch(function(err) {
      throw new Error("Unable to cleanup temporary schema: " + err.message);
    });
    done();
  });
  test("Tournament Search Success", async done => {
    const tournamentObject = {
      search: testTournamentName1
    };
    await request(app)
      .post("/tournaments/search")
      .send(tournamentObject)
      .set("id", testUserEmail)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .expect(async res => {
        try {
          const c = connection.connect(
            databaseConfig.host,
            databaseConfig.username,
            databaseConfig.password,
            databaseConfig.schema
          );
          const row = await sqlwrapper.getTournament(c, 1);
          const tourn = row[0];
          if (
            tourn.id !== 1 ||
            tourn.creator !== testUserEmail ||
            tourn.description !== null ||
            tourn.maxTeamSize !== 1 ||
            tourn.location !== null ||
            tourn.scoringType !== "Points" ||
            tourn.tournamentName !== testTournamentName1 ||
            tourn.tournamentType !== "Single Elim" ||
            tourn.entryCost !== 0 ||
            tourn.maxTeams !== 16 ||
            tourn.startDate !== null ||
            tourn.endDate !== null
          ) {
            throw new Error("Tournament(s) found did not match!");
          }
        } catch (e) {
          e.message = "Something went big boom " + e.message;
          throw e;
        }
      });
    done();
  });
});
