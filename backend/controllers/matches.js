"use strict";

const express = require("express");
const router = express.Router();

const create = require("./matches/create");
const edit = require("./matches/edit");
const deletejs = require("./matches/delete");
const id = require("./matches/id");
const publish = require("./matches/publish");

const requireAuth = require("../middleware/auth/verify");

router.use("/create", requireAuth, create);
router.use("/edit", requireAuth, edit);
router.use("/delete", requireAuth, deletejs);
router.use("/id", id);
router.use("/publish", requireAuth, publish);

module.exports = router;
