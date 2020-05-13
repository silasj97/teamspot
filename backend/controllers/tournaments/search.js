"use strict";

const express = require("express");
const sqlwrapper = require("../../model/wrapper");
const router = express.Router();

router.post("/", async (req, res, next) => {
  if (!req.body || !req.body.search) {
    const err = new Error("Malformed Request");
    err.status = 400;
    next(err);
    return;
  }
  try {
    const c = req.app.get("databaseConnection");
    const results = await sqlwrapper.searchTournament(c, req.body.search);
    res.status(200);
    res.json({ tournaments: results });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
