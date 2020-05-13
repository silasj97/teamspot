"use strict";

const express = require("express");
const sqlwrapper = require("../../../../model/wrapper");
const router = express.Router();

router.post("", async (req, res, next) => {
  if (!req.body || !req.body.teamName) {
    const err = new Error("Malformed Request");
    err.status = 400;
    next(err);
    return;
  }
  if (req.headers.id !== null) {
    try {
      const c = req.app.get("databaseConnection");
      const rows = await sqlwrapper.createTeam(
        c,
        req.body.teamName,
        req.headers.id,
        req.headers.tournamentid,
        false,
        null
      );
      const results = await sqlwrapper.createTeamMember(
        c,
        req.headers.id,
        rows.insertId,
        false,
        false,
        true
      );
      if (results.affectedRows > 0) {
        res.status(200);
        res.json({ teamId: rows.insertId });
      } else {
        const err = new Error(
          "Something went wrong, team created but member not created!"
        );
        next(err);
      }
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
