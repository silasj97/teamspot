"use strict";

const express = require("express");
const router = express.Router();
const sqlwrapper = require("../model/wrapper");

const complete = require("./components/complete");
const create = require("./components/create");
const del = require("./components/delete");
const update = require("./components/update");
const requireAuth = require("../middleware/auth/verify");

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

router.use("/create", requireAuth, create);
router.use("/complete", requireAuth, create);
router.use("/delete", requireAuth, del);
router.use("/update", requireAuth, update);

module.exports = router;
