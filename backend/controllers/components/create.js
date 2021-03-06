"use strict";

const express = require("express");
const sqlwrapper = require("../../model/wrapper");
const router = express.Router();

router.post("", async (req, res, next) => {
  if (
    !req.body.component_name ||
    !req.body.project_id
  ) {
    const err = new Error("Malformed Request");
    err.status = 400;
    next(err);
    return;
  }
  if (req.headers.id !== null) {
    try {
      const con = req.app.get("databaseConnection");
      const rows = await sqlwrapper.createComponent(
        con,
        req.body.component_name,
        req.body.project_id,
        null,
      );
      res.status(200);
      res.json({ id: rows.id})
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
