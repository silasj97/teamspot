"use strict";

const express = require("express");
const sqlwrapper = require("../../model/wrapper");
const router = express.Router();

router.post("", async (req, res, next) => {
  if (
    !req.body ||
    !req.body.id
  ) {
    const err = new Error("Malformed Request");
    err.status = 400;
    next(err);
    return;
  }
  try {
    const connection = req.app.get("databaseConnection");
    const tournamentObject = await sqlwrapper.getMilestone(
      connection,
      req.body.id
    );
    if (1 != 0) {
      await sqlwrapper.updateMilestone(
        connection,
        req.body.milestone_name,
        req.body.priority,
        req.body.description,
        req.body.deadline,
        req.body.id
      );
      res.status(200);
      res.json({ id: req.body.id });
    } else {
      const err = new Error("You cannot edit this milestone!");
      err.status = 401;
      next(err);
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
