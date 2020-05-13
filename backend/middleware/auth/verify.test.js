"use strict";

const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");

const verify = require("./verify");

const app = express();

const authConfig = { authKey: "verifyTestSecret", expiresIn: "1s" };
app.set("authConfig", authConfig);

const mockSuccessRouter = express.Router();
mockSuccessRouter.get("", function(req, res, next) {
  res.status(200);
  res.json({ status: 200, message: "success" });
});

function mockErrorHandler(err, req, res, next) {
  if (err && err.status) {
    res.status(err.status);
    res.json({ status: err.status, message: err.message });
  } else {
    res.status(500);
    res.json({ status: 500, message: "something unexpected happened" });
  }
}

app.use("/", verify, mockSuccessRouter);
app.use(mockErrorHandler);

describe("verify", () => {
  test("Allow valid JWT", async done => {
    const expectedId = "test@gatech.edu";
    const expiresIn = "1s";
    await request(app)
      .get("/")
      .set("id", expectedId)
      .set(
        "Authorization",
        "Bearer " + jwt.sign({ id: expectedId }, app.get("authConfig").authKey),
        { expiresIn: expiresIn }
      )
      .expect("Content-Type", /json/)
      .expect(200);
    done();
  });

  test("Disallow no JWT", async done => {
    const expectedId = "test@gatech.edu";
    await request(app)
      .get("/")
      .set("id", expectedId)
      .expect("Content-Type", /json/)
      .expect(401)
      .expect(function(res) {
        const expectedError = "jwt must be provided";
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

  test("Disallow invalid JWT", async done => {
    const expectedId = "test@gatech.edu";
    await request(app)
      .get("/")
      .set("id", expectedId)
      .set(
        "Authorization",
        "Bearer " + jwt.sign({ id: expectedId }, "incorrect_key")
      )
      .expect("Content-Type", /json/)
      .expect(401)
      .expect(function(res) {
        const expectedError = "invalid signature";
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

  test("Disallow expired JWT", async done => {
    const expectedId = "test@gatech.edu";
    const expiresIn = "-1s";
    await request(app)
      .get("/")
      .set("id", expectedId)
      .set(
        "Authorization",
        "Bearer " +
          jwt.sign({ id: expectedId }, app.get("authConfig").authKey, {
            expiresIn: expiresIn
          })
      )
      .expect("Content-Type", /json/)
      .expect(401)
      .expect(function(res) {
        const expectedError = "jwt expired";
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

  test("Disallow malformed JWT", async done => {
    const expectedId = "test@gatech.edu";
    await request(app)
      .get("/")
      .set("id", expectedId)
      .set("Authorization", "Bearer abcde")
      .expect("Content-Type", /json/)
      .expect(401)
      .expect(function(res) {
        const expectedError = "jwt malformed";
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
