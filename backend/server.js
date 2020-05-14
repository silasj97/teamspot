"use strict";

const config = require("./config");
const app = require("./app");

const port = config.serverConfig.port;
app.listen(port, () => {
  console.log("Server running at port " + port);
});
