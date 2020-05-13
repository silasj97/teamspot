"use strict";

const express = require("express");
const router = express.Router();
const sqlwrapper = require("../model/wrapper");

const accept = require("./invites/accept");
const decline = require("./invites/decline");

const requireAuth = require("../middleware/auth/verify");

router.get("/", async function(req, res, next) {
  try {
    const c = req.app.get("databaseConnection");
    const teamObjects = await sqlwrapper.getInvites(c, req.headers.id);
    res.status(200);
    res.json({ team: teamObjects });
  } catch (err) {
    next(err);
  }
});

router.use("/accept", requireAuth, accept);
router.use("/decline", requireAuth, decline);

module.exports = router;
