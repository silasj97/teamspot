"use strict";

const express = require("express");
const sqlwrapper = require("../../model/wrapper");
const router = express.Router();

router.post("", async (req, res, next) => {
  if (!req.body || req.tournament < 0) {
    const err = new Error("Malformed Request");
    err.status = 400;
    next(err);
    return;
  }
  if (req.headers.id !== null) {
    try {
      const c = req.app.get("databaseConnection");
      const tournamentObject = await sqlwrapper.getTournament(
        c,
        req.body.tournament
      );
      if (!tournamentObject[0]) {
        const err = new Error("Tournament does not exist!");
        err.status = 404;
        next(err);
        return;
      }
      if (req.headers.id === tournamentObject[0].creator) {
        await sqlwrapper.updateTournamentField(
          c,
          tournamentObject[0].id,
          "tournamentType",
          "Custom"
        );
        const rows = await sqlwrapper.createMatch(
          c,
          req.body.location,
          req.body.winner,
          req.body.matchTime,
          req.body.matchName,
          req.body.tournament,
          req.body.teamA,
          req.body.teamB,
          req.body.feederA,
          req.body.feederB,
          req.body.scoreA,
          req.body.scoreB,
          req.body.feederAIsLoser,
          req.body.feederBIsLoser
        );
        res.status(200);
        res.json({ tournamentId: req.body.tournament, matchId: rows.insertId });
      } else {
        const err = new Error("You cannot create matches for this tournament!");
        err.status = 401;
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
