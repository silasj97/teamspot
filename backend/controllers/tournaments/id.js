"use strict";

const express = require("express");
const router = express.Router();

const sqlwrapper = require("../../model/wrapper");

const matches = require("./id/matches");
const teams = require("./id/teams");
const referees = require("./id/referees");
const generate = require("./id/generate");

const requireAuth = require("../../middleware/auth/verify");

router.get("/:id", async function(req, res, next) {
  try {
    const c = req.app.get("databaseConnection");
    const tournamentObject = await sqlwrapper.getTournament(c, req.params.id);
    if (!tournamentObject[0]) {
      const err = new Error("Tournament does not exist!");
      err.status = 404;
      next(err);
      return;
    }
    res.status(200);
    res.json({ tournament: tournamentObject });
  } catch (err) {
    next(err);
  }
});

router.use("/:id", function(req, res, next) {
  req.headers.tournamentid = req.params.id;
  next();
});

router.use("/:id/matches", matches);

router.use("/:id/teams", teams);

router.use("/:id/referees", requireAuth, referees);

router.use("/:id/generate", requireAuth, generate);

module.exports = router;
