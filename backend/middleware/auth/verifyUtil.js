"use strict";

const jwt = require("jsonwebtoken");

function retrieveToken(req) {
  if (!req.headers.authorization) {
    return null;
  }
  const auth = req.headers.authorization.split(" ");
  if (auth[0] === "Bearer" && auth[1]) {
    return auth[1];
  }
  return null;
}

function retrieveAndVerify(req) {
  try {
    const payload = jwt.verify(
      retrieveToken(req),
      req.app.get("authConfig").authKey
    );
    req.headers.id = payload.id;
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = {
  retrieveToken: retrieveToken,
  retrieveAndVerify: retrieveAndVerify
};
