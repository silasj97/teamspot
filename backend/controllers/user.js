"use strict";

const express = require("express");
const router = express.Router();
const sqlwrapper = require("../model/wrapper");

const login = require("./user/login");
const renew = require("./user/renew");
const register = require("./user/register");
const googleauth = require("./user/google-auth");
const tournaments = require("./user/tournaments");

const requireAuth = require("../middleware/auth/verify");

router.use("/login", login);
router.use("/renew", requireAuth, renew);
router.use("/register", register);
router.use("/google-auth", googleauth);
router.use("/tournaments", requireAuth, tournaments);

// POTENTIAL VULNERABILITY, TODO FIX BY RESTRICTING ACCESS
router.get("/", requireAuth, async function(req, res, next) {
  try {
    const c = req.app.get("databaseConnection");
    const results = await sqlwrapper.getUsers(c);
    res.status(200);
    res.json({ users: results });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
