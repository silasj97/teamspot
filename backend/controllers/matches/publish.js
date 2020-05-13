"use strict";

const express = require("express");
const sqlwrapper = require("../../model/wrapper");
const router = express.Router();

router.post("", async (req, res, next) => {
  if (!req.body || req.body.matchId < 0) {
    const err = new Error("Malformed Request");
    err.status = 400;
    next(err);
    return;
  }
  try {
    const c = req.app.get("databaseConnection");
    const matchObject = await sqlwrapper.getMatch(c, req.body.matchId);
    if (!matchObject[0]) {
      const err = new Error("Match does not exist!");
      err.status = 404;
      next(err);
      return;
    }
    const tournamentObject = await sqlwrapper.getTournament(
      c,
      matchObject[0].tournament
    );
    if (!tournamentObject[0]) {
      const err = new Error(
        "Tournament does not exist, should not have happened!"
      );
      next(err);
      return;
    }
    if (req.headers.id === tournamentObject[0].creator) {
      await sqlwrapper.updateMatchField(
        c,
        req.body.matchId,
        "publish",
        req.body.publish
      );
      res.status(200);
      res.json({
        publishStatus: "success"
      });
    } else {
      const err = new Error("You cannot publish this match!");
      err.status = 401;
      next(err);
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
