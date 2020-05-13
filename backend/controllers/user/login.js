"use strict";

const express = require("express");
const jwt = require("jsonwebtoken");
const sqlwrapper = require("../../model/wrapper");
const router = express.Router();

router.post("", async (req, res, next) => {
  if (!req.body || !req.body.email || !req.body.password) {
    const err = new Error("Malformed Request");
    err.status = 400;
    next(err);
    return;
  }
  try {
    const c = req.app.get("databaseConnection");
    const validCredentials = await sqlwrapper.checkCredentials(
      c,
      req.body.email,
      req.body.password
    );
    if (validCredentials) {
      const token = jwt.sign(
        {
          id: req.body.email
        },
        req.app.get("authConfig").authKey,
        { expiresIn: req.app.get("authConfig").expiresIn }
      );
      res.status(200);
      res.json({ jwt: token });
    } else {
      const err = new Error("Invalid Username or Password");
      err.status = 401;
      next(err);
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
