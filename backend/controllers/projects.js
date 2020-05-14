"use strict";

const express = require("express");
const router = express.Router();
const sqlwrapper = require("../model/wrapper");

const create = require("./components/create");

router.get("/", async function(req, res, next) {
  try {
    const c = req.app.get("databaseConnection");
    const results = await sqlwrapper.getProjects(c);
    res.status(200);
    res.json({ projects: results });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
