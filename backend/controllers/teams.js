"use strict";

const express = require("express");
const router = express.Router();

const id = require("./teams/id");

const requireAuth = require("../middleware/auth/verify");

router.use("/id", id);

module.exports = router;
