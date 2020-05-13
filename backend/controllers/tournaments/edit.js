"use strict";

const express = require("express");
const sqlwrapper = require("../../model/wrapper");
const router = express.Router();

router.post("", async (req, res, next) => {
  if (
    !req.body ||
    req.body.tournamentId < 0 ||
    req.body.maxTeamSize < 1 ||
    !req.body.scoringType ||
    !req.body.tournamentType ||
    req.body.entryCost < 0 ||
    req.body.maxTeams < 0
  ) {
    const err = new Error("Malformed Request");
    err.status = 400;
    next(err);
    return;
  }
  try {
    const c = req.app.get("databaseConnection");
    const tournamentObject = await sqlwrapper.getTournament(
      c,
      req.body.tournamentId
    );
    if (!tournamentObject[0]) {
      const err = new Error("Tournament does not exist!");
      err.status = 404;
      next(err);
      return;
    }
    if (req.headers.id === tournamentObject[0].creator) {
      await sqlwrapper.updateTournament(
        c,
        req.body.tournamentId,
        req.headers.id,
        req.body.description,
        req.body.maxTeamSize,
        req.body.location,
        req.body.scoringType,
        req.body.tournamentName,
        req.body.tournamentType,
        req.body.entryCost,
        req.body.maxTeams,
        req.body.startDate,
        req.body.endDate
      );
      res.status(200);
      res.json({ tournamentId: req.body.tournamentId });
    } else {
      const err = new Error("You cannot edit this tournament!");
      err.status = 401;
      next(err);
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
