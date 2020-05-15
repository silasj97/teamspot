"use strict";

const express = require("express");
const router = express.Router();
const sqlwrapper = require("../model/wrapper");

const create = require("./components/create");

router.get("/", async function(req, res, next) {
  try {
    const c = req.app.get("databaseConnection");
    const results = await sqlwrapper.getComponents(c);
    res.status(200);
    res.json({ components: results });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
