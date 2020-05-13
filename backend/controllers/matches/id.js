"use strict";

const express = require("express");
const router = express.Router();

const sqlwrapper = require("../../model/wrapper");
const verifyUtil = require("../../middleware/auth/verifyUtil");

const submit = require("./id/submit");
const requireAuth = require("../../middleware/auth/verify");

router.get("/:id", async function(req, res, next) {
  try {
    const c = req.app.get("databaseConnection");
    let matchObject;
    if (verifyUtil.retrieveAndVerify(req)) {
      matchObject = await sqlwrapper.getMatch(c, req.params.id);
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
      if (req.headers.id !== tournamentObject[0].creator) {
        matchObject = await sqlwrapper.getPublishedMatch(c, req.params.id);
      }
    } else {
      matchObject = await sqlwrapper.getPublishedMatch(c, req.params.id);
    }
    if (!matchObject[0]) {
      const err = new Error("Match does not exist!");
      err.status = 404;
      next(err);
      return;
    }
    res.status(200);
    res.json({ match: matchObject });
  } catch (err) {
    next(err);
  }
});

router.use("/:id", function(req, res, next) {
  req.headers.matchid = req.params.id;
  next();
});

router.use("/:id/submit", requireAuth, submit);

module.exports = router;
