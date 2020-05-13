"use strict";

const express = require("express");

const config = require("./config");
const connection = require("./model/connect");
const user = require("./controllers/user");
const tournaments = require("./controllers/tournaments");
const matches = require("./controllers/matches");
const teams = require("./controllers/teams");
const invites = require("./controllers/invites");

const requireAuth = require("./middleware/auth/verify");

// logging
let log4js = require("log4js");
log4js.configure({
  appenders: {
    filelogger: { type: "file", filename: "output.log" },
    stdoutlogger: { type: "stdout" }
  },
  categories: {
    default: { appenders: ["filelogger", "stdoutlogger"], level: "error" }
  }
});
log4js = log4js.getLogger();
if (config.serverConfig.env === "development") {
  log4js.level = "debug";
} else {
  log4js.level = "error";
}

const app = express();

// set logger
app.set("logger", log4js);
// set server config
app.set("serverConfig", config.serverConfig);
// set authentication config
app.set("authConfig", config.authConfig);
// set database config
app.set("databaseConfig", config.databaseConfig);
// Initiate database connection
connection.connect(
  app.get("databaseConfig").host,
  app.get("databaseConfig").username,
  app.get("databaseConfig").password,
  app.get("databaseConfig").schema,
  app
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if (app.get("serverConfig").env === "development") {
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });
}

app.use("/api/user", user);
app.use("/api/tournaments", tournaments);
app.use("/api/matches", matches);
app.use("/api/teams", teams);
app.use("/api/invites", requireAuth, invites);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error =
    req.app.get("serverConfig").env === "development" ? err : {};

  // send back error
  err.status = err.status || 500;

  // don't leak error if not in development
  if (req.app.get("serverConfig").env !== "development" && err.status === 500) {
    err.message = "Internal Server Error";
  } else if (err.status < 500) {
    log4js.warn(
      `${req.header("x-forwarded-for")} - ${req.url} - ${err.message}`
    );
  } else {
    log4js.error(err);
  }
  res.status(err.status);
  res.json({ status: err.status, message: err.message });
});

if (app.get("env") === "development") {
  app.locals.pretty = true;
}

module.exports = app;
