"use strict";

const express = require("express");
const router = express.Router();
const sqlwrapper = require("../../../model/wrapper");
const verifyUtil = require("../../../middleware/auth/verifyUtil");

router.get("/", async function(req, res, next) {
  try {
    const c = req.app.get("databaseConnection");
    if (verifyUtil.retrieveAndVerify(req)) {
      const tournamentObject = await sqlwrapper.getTournament(
        c,
        req.headers.tournamentid
      );
      if (!tournamentObject[0]) {
        const err = new Error("Tournament does not exist!");
        err.status = 404;
        next(err);
        return;
      }
      if (req.headers.id === tournamentObject[0].creator) {
        const results = await sqlwrapper.getMatches(
          c,
          req.headers.tournamentid
        );
        res.status(200);
        res.json({ matches: results });
      } else {
        const results = await sqlwrapper.getPublishedMatches(
          c,
          req.headers.tournamentid
        );
        res.status(200);
        res.json({ matches: results });
      }
    } else {
      const results = await sqlwrapper.getPublishedMatches(
        c,
        req.headers.tournamentid
      );
      res.status(200);
      res.json({ matches: results });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
