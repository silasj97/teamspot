"use strict";

const express = require("express");
const router = express.Router();

const promote = require("./teams/promote");
const remove = require("./teams/remove");
const invite = require("./teams/invite");
const charge = require("./teams/charge");
const id = require("./teams/id");

const requireAuth = require("../middleware/auth/verify");

router.use("/promote", requireAuth, promote);
router.use("/remove", requireAuth, remove);
router.use("/invite", requireAuth, invite);
router.use("/charge", requireAuth, charge);
router.use("/id", id);

module.exports = router;
