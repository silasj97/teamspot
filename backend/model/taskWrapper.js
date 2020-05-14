"use strict";

module.exports = {
  createTask: (
    connection,
    task_name = null,
    milestone_id,
    priority = 0,
    description = "",
    deadline = null,
    comments = ""
  ) => {
    let query = "";
    return new Promise((resolve, reject) => {
      connection.query(query,
        [
          task_name,
          milestone_id,
          priority,
          description,
          deadline,
          comments
        ],
        (err, rows, fields) => {
          if (err) {
            reject(err);
          } else {
            resolve(err);
          }
        }
      );
    });
  },
  getTask: (connection, taskID) => {
    let query = `SELECT * FROM task WHERE id = ${taskID};`;
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
  getTasks: (connection) => {
    let query = "SELECT * FROM tasks";
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
  updateTask: (
    connection
  ) => {

  }
};
