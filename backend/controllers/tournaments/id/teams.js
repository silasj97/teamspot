"use strict";

const express = require("express");
const router = express.Router();
const sqlwrapper = require("../../../model/wrapper");

const create = require("./teams/create");
const withdraw = require("./teams/withdraw");

const requireAuth = require("../../../middleware/auth/verify");

router.get("/", async function(req, res, next) {
  try {
    const c = req.app.get("databaseConnection");
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
    const results = await sqlwrapper.getTeams(c, req.headers.tournamentid);
    res.status(200);
    res.json({ teams: results });
  } catch (err) {
    next(err);
  }
});

router.use("/create", requireAuth, create);
router.use("/withdraw", requireAuth, withdraw);

module.exports = router;
