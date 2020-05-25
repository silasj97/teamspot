"use strict";

const express = require("express");
const router = express.Router();
const sqlwrapper = require("../model/wrapper");

const complete = require("./milestones/complete");
const create = require("./milestones/create");
const del = require("./milestones/delete");
const update = require("./milestones/update");
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
router.use("/delete", requireAuth, del);
router.use("/update", requireAuth, update);

module.exports = router;
