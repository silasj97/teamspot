"use strict";

module.exports = {
  createTask: (
    connection,
    task_name,
    milestone_id,
    priority,
    description,
    deadline,
    comments,
    completed
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
          comments,
          completed
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

  },
  send: (connection, id, message) => {

  },
  getMessages: (connection, id) => {

  }
};
