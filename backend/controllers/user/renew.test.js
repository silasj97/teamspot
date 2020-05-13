"use strict";

const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");

const renew = require("./renew");

const app = express();
const authConfig = { authKey: "renewTestSecret", expiresIn: "1s" };
app.set("authConfig", authConfig);
app.use("/user/renew", renew);

describe("renew", () => {
  test("Return a valid JWT", async done => {
    const expectedId = "test@gatech.edu";
    await request(app)
      .get("/user/renew")
      .set("id", expectedId)
      .expect("Content-Type", /json/)
      .expect(200)
      .expect(res => {
        try {
          const payload = jwt.verify(
            res.body.jwt,
            app.get("authConfig").authKey
          );
          if (payload.id !== expectedId) {
            throw new Error(
              "Unexpected ID, expected " +
                expectedId +
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
});
