"use strict";

const request = require("supertest");
const express = require("express");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");

const config = require("../../config");
const sqlwrapper = require("../../model/wrapper");
const connection = require("../../model/connect");
const login = require("./login");

const app = express();
app.use(express.json());
const databaseConfig = {
  host: config.databaseConfig.host,
  username: config.databaseConfig.username,
  password: config.databaseConfig.password,
  schema: "temploginjestschema"
};
const authConfig = { authKey: "loginTestSecret", expiresIn: "1s" };
app.set("authConfig", authConfig);
app.set("serverConfig", config.serverConfig);
app.set("databaseConfig", databaseConfig);

function mockErrorHandler(err, req, res, next) {
  if (err) {
    res.status(err.status);
    res.json({ status: err.status, message: err.message });
  } else {
    res.status(500);
    res.json({ status: 500, message: "something unexpected happened" });
  }
}

app.use("/user/login", login);
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

describe("login", () => {
  const testUserEmail = "test@gatech.edu";
  const testUserPassword = "testpassword";
  const testUserName = "Test User";
  const temporarySchema = "temploginjestschema";
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
      .createUser(c, testUserName, testUserEmail, testUserPassword, 0)
      .catch(function(err) {
        throw new Error("Unable to create user: " + err.message);
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

  test("Login Success", async done => {
    const loginObject = {
      email: testUserEmail,
      password: testUserPassword
    };
    await request(app)
      .post("/user/login")
      .send(loginObject)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .expect(res => {
        try {
          const payload = jwt.verify(
            res.body.jwt,
            app.get("authConfig").authKey
          );
          if (payload.id !== testUserEmail) {
            throw new Error(
              "Unexpected ID, expected " +
                testUserEmail +
                ", got " +
                payload.id +
                " instead"
            );
          }
        } catch (e) {
          e.message =
            "Returned JWT is not valid for some reason or another: " +
            e.message;
          throw e;
        }
      });
    done();
  });

  test("Login Fail Incorrect Password", async done => {
    const loginObject = {
      email: testUserEmail,
      password: "incorrect_password"
    };
    await request(app)
      .post("/user/login")
      .send(loginObject)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(401)
      .expect(res => {
        const expectedError = "Invalid Username or Password";
        if (res.body.message !== expectedError) {
          throw new Error(
            "Expected error: " +
              expectedError +
              ", received: " +
              res.body.message
          );
        }
      });
    done();
  });

  test("Login Fail Incorrect Username", async done => {
    const loginObject = {
      email: "thisUsernameDoesNotExist",
      password: testUserPassword
    };
    await request(app)
      .post("/user/login")
      .send(loginObject)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(401)
      .expect(res => {
        const expectedError = "Invalid Username or Password";
        if (res.body.message !== expectedError) {
          throw new Error(
            "Expected error: " +
              expectedError +
              ", received: " +
              res.body.message
          );
        }
      });
    done();
  });
});
