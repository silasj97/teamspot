"use strict";

const express = require("express");
const router = express.Router();
const sqlwrapper = require("../model/wrapper");

const create = require("./tasks/create");
const assign = require("./tasks/assign");
const complete = require("./tasks/complete");
const requireAuth = require("../middleware/auth/verify");

router.get("/", async function(req, res, next) {
  try {
    const c = req.app.get("databaseConnection");
    const results = await sqlwrapper.getTasks(c);
    res.status(200);
    res.json({ tasks: results });
  } catch (err) {
    next(err);
  }
});

router.use("/create", requireAuth, create);
router.use("/complete", requireAuth, create);

module.exports = router;
