"use strict";

const express = require("express");
const router = express.Router();

const sqlwrapper = require("../../model/wrapper");

const members = require("./id/members");

router.get("/:id", async function(req, res, next) {
  try {
    const c = req.app.get("databaseConnection");
    const teamObject = await sqlwrapper.getTeam(c, req.params.id);
    if (!teamObject[0]) {
      const err = new Error("Team does not exist!");
      err.status = 404;
      next(err);
      return;
    }
    res.status(200);
    res.json({ team: teamObject });
  } catch (err) {
    next(err);
  }
});

router.use("/:id", function(req, res, next) {
  req.headers.teamid = req.params.id;
  next();
});

router.use("/:id/members", members);

module.exports = router;
