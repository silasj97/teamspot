"use strict";

const request = require("supertest");
const express = require("express");
const mysql = require("mysql");

const config = require("../config");
const sqlwrapper = require("../model/wrapper");
const connection = require("../model/connect");
const tournaments = require("./tournaments");

const app = express();
app.use(express.json());
const databaseConfig = {
  host: config.databaseConfig.host,
  username: config.databaseConfig.username,
  password: config.databaseConfig.password,
  schema: "temptournamentsjestschema"
};
const authConfig = { authKey: "tournamentsTestSecret", expiresIn: "1s" };
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

app.use("/tournaments", tournaments);
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
  await sqlwrapper.executeSQL(specC, setupUsersTableQuery, []);
  await sqlwrapper.executeSQL(specC, setupTournamentsTableQuery, []);
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

describe("tournaments", () => {
  const testUserEmail = "test@gatech.edu";
  const testUserPassword = "testpassword";
  const testUserName = "Test User";
  const temporarySchema = "temptournamentsjestschema";
  const testTournamentName1 = "Test Tournament";
  const testTournamentName2 = "Bob's Bowling Tournament";
  const testTournamentName3 = "Test Tournament 2";
  const testT1Date = "9999-01-10";
  const testT2Date = "9999-01-20";
  const testT3Date = "9999-01-01";
  const t1Date = new Date("January 10, 9999 UTC");
  const t2Date = new Date("January 20, 9999 UTC");
  const t3Date = new Date("January 1, 9999 UTC");
  const tt1Date = t1Date.toISOString();
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
    const c = connection.connect(
      databaseConfig.host,
      databaseConfig.username,
      databaseConfig.password,
      temporarySchema
    );
    await sqlwrapper
      .createUser(c, testUserName, testUserEmail, testUserPassword, 0)
      .catch(function(err) {
        throw new Error("Unable to create user: " + err.message);
      });
    await sqlwrapper
      .createTournament(
        c,
        testUserEmail,
        testTournamentName1,
        null,
        false,
        null,
        "Points",
        "Single Elim",
        0,
        16,
        testT1Date,
        null
      )
      .catch(function(err) {
        throw new Error("Unable to create tournament: " + err.message);
      });
    await sqlwrapper
      .createTournament(
        c,
        testUserEmail,
        testTournamentName2,
        null,
        false,
        null,
        "Points",
        "Single Elim",
        0,
        16,
        testT2Date,
        null
      )
      .catch(function(err) {
        throw new Error("Unable to create tournament: " + err.message);
      });
    await sqlwrapper
      .createTournament(
        c,
        testUserEmail,
        testTournamentName3,
        null,
        false,
        null,
        "Points",
        "Single Elim",
        0,
        16,
        testT3Date,
        null
      )
      .catch(function(err) {
        throw new Error("Unable to create tournament: " + err.message);
      });
    c.destroy();
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

  test("Tournaments Success ", async done => {
    await request(app)
      .get("/tournaments")
      .expect("Content-Type", /json/)
      .expect(200)
      .expect(res => {
        try {
          if (
            res.body.tournaments[0].creator !== testUserEmail ||
            res.body.tournaments[0].tournamentName !== testTournamentName2 ||
            res.body.tournaments[0].startDate !== tt2Date
          ) {
            throw new Error("Creator or tournament name does not match!");
          }
          if (
            res.body.tournaments[1].creator !== testUserEmail ||
            res.body.tournaments[1].tournamentName !== testTournamentName1 ||
            res.body.tournaments[1].startDate !== tt1Date
          ) {
            throw new Error("Creator or tournament name does not match!");
          }
          if (
            res.body.tournaments[2].creator !== testUserEmail ||
            res.body.tournaments[2].tournamentName !== testTournamentName3 ||
            res.body.tournaments[2].startDate !== tt3Date
          ) {
            throw new Error("Creator or tournament name does not match!");
          }
          if (t2Date < t1Date || t2Date < t3Date || t1Date < t3Date) {
            throw new Error("Tournaments are not in descending order!");
          }
        } catch (e) {
          e.message =
            "Returned tournaments is not valid for some reason or another: " +
            e.message;
          throw e;
        }
      });
    done();
  });
});
