"use strict";

const express = require("express");
const router = express.Router();
const sqlwrapper = require("../../../model/wrapper");

router.post("", async (req, res, next) => {
  if (!req.body || req.headers.matchid < 0) {
    const err = new Error("Malformed Request");
    err.status = 400;
    next(err);
    return;
  }
  try {
    const c = req.app.get("databaseConnection");
    const matchObject = await sqlwrapper.getMatch(c, req.headers.matchid);
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
    const referees = await sqlwrapper.getReferees(c, tournamentObject[0].id);
    let isRef = false;
    let i;
    for (i = 0; i < referees.length; i++) {
      if (referees[i].userEmail === req.headers.id) {
        isRef = true;
      }
    }
    if (isRef) {
      await sqlwrapper.updateMatchField(
        c,
        req.headers.matchid,
        "scoreA",
        req.body.scoreA
      );
      await sqlwrapper.updateMatchField(
        c,
        req.headers.matchid,
        "scoreB",
        req.body.scoreB
      );
      await sqlwrapper.updateMatchField(
        c,
        req.headers.matchid,
        "winner",
        req.body.winner
      );
      if (req.body.winner !== 0) {
        await sqlwrapper.reloadMatches(c, req.headers.matchid);
      }
      res.status(200);
      res.json({ scoreSubmitSuccess: true });
    } else {
      const err = new Error("You cannot score this match!");
      err.status = 401;
      next(err);
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
