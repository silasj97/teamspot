"use strict";

const config = require("../config");
const connection = require("./connect");

const databaseConfig = {
  host: config.databaseConfig.host,
  username: config.databaseConfig.username,
  password: config.databaseConfig.password,
  schema: "temploginjestschema"
};

describe("connect", () => {
  test("Connect to the MySQL database", done => {
    const c = connection.connect(
      databaseConfig.host,
      databaseConfig.username,
      databaseConfig.password,
      databaseConfig.schema
    );
    c.destroy();
    done();
  });
});
