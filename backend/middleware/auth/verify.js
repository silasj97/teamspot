"use strict";

const util = require("./verifyUtil");

const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  try {
    const payload = jwt.verify(
      util.retrieveToken(req),
      req.app.get("authConfig").authKey
    );
    req.headers.id = payload.id;
  } catch (e) {
    e.status = 401;
    next(e);
  }
  next();
}

module.exports = verifyToken;
