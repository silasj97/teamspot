"use strict";

const express = require("express");
const router = express.Router();
const sqlwrapper = require("../model/wrapper");

const create = require("./components/create");

router.get("/", async function(req, res, next) {
  try {
    const c = req.app.get("databaseConnection");
    const results = await sqlwrapper.getComponents(c);
    res.status(200);
    for (var i in results) {
      let milestones = sqlwrapper.getComponentMilestones(c, results[i].component_id);
      for (var j in milestones) {
        milestones[j][tasks] = { tasks: sqlwrapper.getComponentTasks(c, results[j].milestone_id) };
      }
      results[i][milestones] = { milestones: milestones };
    }
    res.json({ components: results });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
