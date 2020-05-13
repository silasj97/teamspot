"use strict";

const express = require("express");
const sqlwrapper = require("../../model/wrapper");
const router = express.Router();

router.post("", async (req, res, next) => {
  if (!req.body || !(req.body.teamId > 0)) {
    const err = new Error("Malformed Request");
    err.status = 400;
    next(err);
    return;
  }
  if (req.headers.id !== null) {
    try {
      const c = req.app.get("databaseConnection");
      const results = await sqlwrapper.updateTeamMember(
        c,
        req.headers.id,
        req.body.teamId,
        false,
        false,
        false
      );
      if (results.affectedRows > 0) {
        res.status(200);
        res.json({ promoteStatus: true });
      } else {
        const err = new Error("Something went wrong, status not updated!");
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
