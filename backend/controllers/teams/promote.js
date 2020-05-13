"use strict";

const express = require("express");
const sqlwrapper = require("../../model/wrapper");
const router = express.Router();

router.post("", async (req, res, next) => {
  if (!req.body || !(req.body.teamId > 0) || !req.body.email_to_promote) {
    const err = new Error("Malformed Request");
    err.status = 400;
    next(err);
    return;
  }
  try {
    const c = req.app.get("databaseConnection");
    const teamObject = await sqlwrapper.getTeam(c, req.body.teamId);
    if (!teamObject[0]) {
      const err = new Error("Team does not exist!");
      err.status = 404;
      next(err);
      return;
    }
    if (req.headers.id === teamObject[0].leader) {
      const results = await sqlwrapper.updateTeamField(
        c,
        req.body.team_id,
        "leader",
        req.body.email_to_promote
      );
      if (results.affectedRows > 0) {
        res.status(200);
        res.json({ promoteStatus: true });
      } else {
        const err = new Error("Something went wrong, leader not updated!");
        next(err);
      }
    } else {
      const err = new Error(
        "You cannot promote someone to leader of this the team!"
      );
      err.status = 401;
      next(err);
    }
  } catch (err) {
    err.status = 500;
    next(err);
  }
});

module.exports = router;
