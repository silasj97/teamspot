"use strict";

const express = require("express");
const router = express.Router();
const sqlwrapper = require("../../../../model/wrapper");

router.post("", async (req, res, next) => {
  if (!req.body) {
    const err = new Error("Malformed Request");
    err.status = 400;
    next(err);
    return;
  }
  if (req.headers.id !== null) {
    try {
      const c = req.app.get("databaseConnection");
      await sqlwrapper.createReferee(
        c,
        req.headers.tournamentid,
        req.body.email
      );
      res.status(200);
      res.json({ addSuccess: true });
    } catch (err) {
      err.status = 500;
      next(err);
    }
  } else {
    const err = new Error("Invalid Credentials");
    err.status = 401;
    next(err);
  }
});

module.exports = router;
