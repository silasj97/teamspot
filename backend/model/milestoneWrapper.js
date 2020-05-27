"use strict";

module.exports = {
  createMilestone: (
    connection,
    milestone_name,
    project_component_id,
    priority,
    description,
    deadline,
    comments,
    completed
  ) => {
    let query = "INSERT INTO milestone(milestone_name, project_component_id, priority, description, deadline, comments, completed) VALUES(?, ?, ?, ?, ?, ?, ?)";
    return new Promise((res, rej) => {
      connection.query(query,
        [
          milestone_name,
          project_component_id,
          priority,
          description,
          deadline,
          comments,
          completed
        ],
        (err, rows, fields) => {
          if (err) {
            rej(err);
          } else {
            res(rows);
          }
        }
      );
    });
  },
  getMilestone: (connection, milestoneID) => {
    let query = `SELECT * FROM milestone WHERE id = ${milestoneID};`;
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
  getMilestones: (connection) => {
    let query = "SELECT * FROM milestone;";
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
  getMilestoneTasks: (connection, milestoneID) => {
    let query = `SELECT * FROM task WHERE milestone_id = "${milestoneID}"`;
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
  updateMilestone: (
    connection,
    milestone_name,
    priority,
    description,
    deadline,
    id
  ) => {
    let query = "UPDATE milestone SET milestone_name = ?, priority = ?, description = ?, deadline = ? WHERE id = ?;";
    return new Promise((resolve, reject) => {
      connection.query(
        query,
        [
          milestone_name,
          priority,
          description,
          deadline,
          id
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
  complete: (connection, id) => {
    let query = "UPDATE milestone SET completed = 1 where id = '${id}'";
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
    let query = "DELETE FROM milestone WHERE id = ${id};";
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
