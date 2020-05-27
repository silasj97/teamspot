"use strict";

require('dotenv').config()
const config = require("./config");
const app = require("./app");

const port = config.serverConfig.port;
const server = app.listen(port, () => {
  console.log("Server running at port " + port);
});

module.exports = server;
