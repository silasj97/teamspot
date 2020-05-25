"use strict";

const express = require("express");
const sqlwrapper = require("../../model/wrapper");
const router = express.Router();

router.post("", async (req, res, next) => {
  if (!req.body || !req.body.user_id || !req.body.task_id) {
    const err = new Error("Malformed Request");
    err.status = 400;
    next(err);
    return;
  }
  try {
    const c = req.app.get("databaseConnection");
    const a = await sqlwrapper.assignTask(c, req.body.user_id, req.body.task_id);
    res.status(200);
    res.json({ assigned: rows.user_id})
  } catch (err) {
    next(err);
  }
});

module.exports = router;
