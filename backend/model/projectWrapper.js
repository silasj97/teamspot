"use strict";

//const express = require("express");

module.exports = {
  createProject: (
    connection,
    project_name,
    deadline,
    project_description,
    comments,
    completed
  ) => {
    let query = "INSERT INTO project(project_name, deadline, project_description, comments, completed) VALUES(?, ?, ?, ?, ?, ?)";
    return new Promise((resolve, reject) => {
      connection.query(
        query,
        [
          project_name,
          deadline,
          project_description,
          comments,
          completed
        ],
        (err, rows, fields) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
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

  },
  sendMessage: (connection, message) => {

  },
  getMessages: (connection) => {

  },
  complete: (connection, id) => {
    let query = "UPDATE project SET completed = 1 where id = ${id}";
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
  delete: (connection, id) => {
    let query = "DELETE FROM project WHERE id = ${id};";
    return new Promise((res, rej) => {
      connection.query(query, (err, rows, fields) => {
        if (err) {
          rej(err);
        } else {
          res(rows);
        }
      });
    });
  }
};
