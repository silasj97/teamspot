"use strict";

module.exports = {
  createComponent: (
    connection,
    component_name = null,
    project_id
  ) => {
    let query = "INSERT INTO project_component(component_name, project_id) VALUES(?, ?)";
    return new Promise((resolve, reject) => {
      connection.query(
        query,
        [
          component_name,
          project_id
        ],
        (err, rows, fields) => {
          if (err) {
            reject(err);
          } else {
            resolve(err);
          }
        }
      )
    });
  },
  getComponents: (connection) => {
    let query = "SELECT * FROM project_component;";
    return new Promise((res, rej) => {
      connection.query(query, (err, rows, fields) => {
        if (err) {
          rej(err);
        } else {
          res(rows);
        }
      });
    });
  },
  getComponent: (connection, componentID) => {
    let query = `SELECT * FROM project_component WHERE id = ${componentID};`;
    return new Promise((res, rej) => {
      connection.query(query, (err, rows, fields) => {
        if (err) {
          rej(err);
        } else {
          res(rows);
        }
      });
    });
  },
  getComponentMilestones: (connection, componentID) => {
    let query = `SELECT * FROM milestone WHERE project_component_id = "${componentID}"`;
    return new Promise((resolve, reject) => {
      connection.query(query, (err, rows, fields) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },
  updateComponent: (
    connection
  ) => {

  }
};
