"use strict";

const express = require("express");
const router = express.Router();
const sqlwrapper = require("../../../../model/wrapper");

router.post("", async (req, res, next) => {
  if (!req.body) {
    const err = new Error("Malformed Request");
    err.status = 400;
    next(err);
    return;
  }
  if (req.headers.id !== null) {
    try {
      const c = req.app.get("databaseConnection");
      const rows = await sqlwrapper.deleteReferee(
        c,
        req.headers.tournamentid,
        req.body.email
      );
      if (rows.affectedRows > 0) {
        res.status(200);
        res.json({ removeSuccess: "success" });
      } else {
        const err = new Error(
          "Something went wrong, referee cannot be deleted!"
        );
        next(err);
      }
    } catch (err) {
      err.status = 500;
      next(err);
    }
  } else {
    const err = new Error("Invalid Credentials");
    err.status = 401;
    next(err);
  }
});

module.exports = router;
