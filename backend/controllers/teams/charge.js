"use strict";

const express = require("express");
const sqlwrapper = require("../../model/wrapper");
const router = express.Router();
const config = require("../../config");
const stripe = require("stripe")(config.stripeConfig.secretKey);

router.post("", async (req, res, next) => {
  if (!req.body || !(req.body.teamId > 0) || !req.body.token) {
    const err = new Error("Malformed Request");
    err.status = 400;
    next(err);
    return;
  }
  try {
    const c = req.app.get("databaseConnection");
    const teamObject = await sqlwrapper.getTeam(c, req.body.teamId);
    if (!teamObject[0]) {
      const err = new Error("Team does not exist!");
      err.status = 404;
      next(err);
      return;
    }
    if (req.headers.id === teamObject[0].leader) {
      const team = teamObject[0];
      await stripe.charges.create({
        amount: team.entryCost * 100,
        currency: "usd",
        description: "Team Entry Fee",
        source: req.body.token
      });
      const results = await sqlwrapper.updateTeam(
        c,
        team.id,
        team.teamName,
        team.leader,
        team.tournament,
        true,
        team.seed
      );
      if (results.affectedRows > 0) {
        res.status(200);
        res.json({ paymentStatus: true });
      } else {
        const err = new Error("Something went wrong, team not paid for!");
        next(err);
      }
    } else {
      const err = new Error("You do not have permission to pay for the team!");
      err.status = 401;
      next(err);
    }
  } catch (err) {
    err.status = 500;
    next(err);
  }
});

module.exports = router;
