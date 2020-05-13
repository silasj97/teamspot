"use strict";

const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.get("", (req, res, next) => {
  const token = jwt.sign(
    {
      id: req.headers.id
    },
    req.app.get("authConfig").authKey,
    { expiresIn: req.app.get("authConfig").expiresIn }
  );
  res.status(200);
  res.json({ jwt: token });
});

module.exports = router;
