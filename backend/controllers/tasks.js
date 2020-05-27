"use strict";

const express = require("express");
const router = express.Router();
const sqlwrapper = require("../model/wrapper");

const assign = require("./tasks/assign");
const complete = require("./tasks/complete");
const create = require("./tasks/create");
const del = require("./tasks/delete");
const update = require("./tasks/update");
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

router.use("/assign", requireAuth, assign);
router.use("/create", requireAuth, create);
router.use("/complete", requireAuth, complete);
router.use("/delete", requireAuth, del);
router.use("/update", requireAuth, update);

module.exports = router;
