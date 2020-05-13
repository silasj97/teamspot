"use strict";

const request = require("supertest");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const express = require("express");

const config = require("../../config");
const sqlwrapper = require("../../model/wrapper");
const connection = require("../../model/connect");
const id = require("./id");
const invite = require("./invite");
const promote = require("./promote");
const remove = require("./remove");
const create = require("../tournaments/id/teams/create");
const withdraw = require("../tournaments/id/teams/withdraw");
const members = require("./id/members");

let dc;
const app = express();
app.use(express.json());
const databaseConfig = {
  host: config.databaseConfig.host,
  username: config.databaseConfig.username,
  password: config.databaseConfig.password,
  schema: "tempteamschema"
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

app.use("/teams/id", id);
app.use("/teams/invite", invite);
app.use("/teams/promote", promote);
app.use("/teams/remove", remove);
app.use("/tournaments/id/1/teams/create", create);
app.use("/tournaments/id/1/teams/withdraw", withdraw);
app.use("/teams/id/members", members);
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
      score VARCHAR(255) DEFAULT NULL,
      winner BOOL DEFAULT NULL,
      matchTime DATETIME DEFAULT NULL,
      matchName VARCHAR(255) DEFAULT NULL,
      tournament INT(10) NOT NULL,
      teamA INT(12) NOT NULL,
      teamB INT(12) NOT NULL,
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
  await sqlwrapper.executeSQL(specC, setupExampleUserQuery, [
    "example1@example.com",
    await bcrypt.hash("example", 10),
    "example1"
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
  dc.destroy();
}

describe("teams", () => {
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

  test("Team Creation", async done => {
    const teamObject = {
      teamName: "test Team Name"
    };
    const testUserEmail = "example@example.com";
    const testTournament = 1;
    await request(app)
      .post("/tournaments/id/1/teams/create")
      .send(teamObject)
      .set("id", testUserEmail)
      .set("tournamentid", testTournament)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .expect(res => {
        try {
          if (!(res.body.teamId > 0)) {
            throw new Error("Creation failed");
          }
        } catch (e) {
          e.message = "Something went big boom " + e.message;
          throw e;
        }
      });
    done();
  });

  test("Team Invite", async done => {
    const testUserEmail = "example@example.com";
    const testUserEmail1 = "example1@example.com";
    const teamObject = {
      teamId: 1,
      email: testUserEmail1
    };
    await request(app)
      .post("/teams/invite")
      .send(teamObject)
      .set("id", testUserEmail)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .expect(res => {
        try {
          if (!res.body.inviteStatus) {
            throw new Error("Invite failed");
          }
        } catch (e) {
          e.message = "Something went big boom " + e.message;
          throw e;
        }
      });
    done();
  });
});
