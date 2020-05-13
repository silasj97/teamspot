"use strict";

const express = require("express");
const router = express.Router();
const sqlwrapper = require("../../../model/wrapper");

const add = require("./referees/add");
const remove = require("./referees/remove");
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
    const results = await sqlwrapper.getReferees(c, req.headers.tournamentid);
    res.status(200);
    res.json({ referees: results });
  } catch (err) {
    next(err);
  }
});

router.use("/add", requireAuth, add);
router.use("/remove", requireAuth, remove);

module.exports = router;
