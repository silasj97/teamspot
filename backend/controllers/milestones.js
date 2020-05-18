"use strict";

const express = require("express");
const router = express.Router();
const sqlwrapper = require("../model/wrapper");

const create = require("./milestones/create");
const complete = require("./milestones/complete");
const requireAuth = require("../middleware/auth/verify");

router.get("/", async function(req, res, next) {
  try {
    const c = req.app.get("databaseConnection");
    const results = await sqlwrapper.getMilestones(c);
    res.status(200);
    res.json({ milestones: results });
  } catch (err) {
    next(err);
  }
});

router.use("/create", requireAuth, create);
router.use("/complete", requireAuth, create);

module.exports = router;
