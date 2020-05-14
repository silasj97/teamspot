"use strict";

module.exports = {
  createProject: (
    connection,
    project_name = null,
    deadline = null,
    project_description = "",
    comments = ""
  ) => {
    let query = "INSERT INTO project(project_name, deadline, project_description, comments) VALUES(?, ?, ?, ?, ?)";
    return new Promise((resolve, reject) => {
      connection.query(
        query,
        [
          project_name,
          deadline,
          project_description,
          comments
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
  getProjects: (connection) => {
    let query = "SELECT * FROM project;";
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
  getProject: (connection, projectID) => {
    let query = `SELECT * FROM project WHERE id = "${projectID}";`;
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
  getProjectComponents: (connection, projectID) => {
    let query = `SELECT * FROM components WHERE project_id = "${projectID};"`;
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
  updateProject: (
    connection
  ) => {

  }
};
