"use strict";

const express = require("express");
const router = express.Router();
const sqlwrapper = require("../model/wrapper");

const create = require("./components/create");

router.get("/", async function(req, res, next) {
  try {
    const con = req.app.get("databaseConnection");
    const c = await sqlwrapper.getComponents(con);
    res.status(200);
    const components = JSON.parse(JSON.stringify(c));
    for (let component in components) {
      var m = await sqlwrapper.getComponentMilestones(con, components[component].id);
      components[component].milestones = JSON.parse(JSON.stringify(m));
      for (let milestone in components[component].milestones) {
        var t = await sqlwrapper.getMilestoneTasks(con, components[component].milestones[milestone].id)
        components[component].milestones[milestone].tasks = JSON.parse(JSON.stringify(t));
      }
    }
    res.json({ components: components });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
