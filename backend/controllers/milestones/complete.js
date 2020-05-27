"use strict";

const express = require("express");
const sqlwrapper = require("../../model/wrapper");
const router = express.Router();

router.post("", async (req, res, next) => {
  if (!req.body.id) {
    const err = new Error("Malformed Request");
    err.status = 400;
    next(err);
    return;
  } try {
    const con = req.app.get("databaseConnection");
    const status = await sqlwrapper.checkMilestoneStatus(con, req.body.id);
    const obj = JSON.parse(JSON.stringify(status));
    console.log(obj);
    if (obj.completed == 1) {
      const rows = await sqlwrapper.completeMilestone(con, req.body.id, 0);
    } else {
      const rows = await sqlwrapper.completeMilestone(con, req.body.id, 1);
    }
    res.status(200);
    res.json({ id: rows.id});
  } catch (err) {
    err.status = 500;
    next(err);
  }
});

module.exports = router;
