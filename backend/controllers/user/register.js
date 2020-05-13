"use strict";

const express = require("express");
const jwt = require("jsonwebtoken");
const sqlwrapper = require("../../model/wrapper");
const router = express.Router();

router.post("", async (req, res, next) => {
  if (!req.body || !req.body.email || !req.body.password || !req.body.name) {
    const err = new Error("Malformed Request");
    err.status = 400;
    next(err);
    return;
  }
  try {
    const c = req.app.get("databaseConnection");
    const userExists = await sqlwrapper.userExists(c, req.body.email);
    if (userExists) {
      const err = new Error("User already exists!");
      err.status = 409;
      throw err;
    } else {
      await sqlwrapper.createUser(
        c,
        req.body.name,
        req.body.email,
        req.body.password
      );
    }
    const token = jwt.sign(
      {
        id: req.body.email
      },
      req.app.get("authConfig").authKey,
      { expiresIn: req.app.get("authConfig").expiresIn }
    );
    res.status(200);
    res.json({ jwt: token });
  } catch (err) {
    err.status = err.status || 500;
    next(err);
  }
});

module.exports = router;
