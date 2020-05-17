"use strict";

module.exports = {
  createTeam: (
    connection,
    teamName = null,
    leader,
    tournament,
    paid = false,
    seed = null
  ) => {
    const query =
      "INSERT INTO teams(teamName, leader, tournament, paid, seed) VALUES(?, ?, ?, ?, ?)";
    return new Promise((resolve, reject) => {
      connection.query(
        query,
        [teamName, leader, tournament, paid, seed],
        function(err, rows, fields) {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  },
  getTeam: (connection, id) => {
    const query =
      "SELECT teams.*, entryCost FROM teams LEFT JOIN tournaments ON tournaments.id = teams.tournament WHERE teams.id = ?;";
    return new Promise((resolve, reject) => {
      connection.query(query, [id], function(err, rows, fields) {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },
  getTeams: (connection, tournamentId) => {
    const query =
      "SELECT teams.*, entryCost FROM teams LEFT JOIN tournaments ON tournaments.id = teams.tournament WHERE teams.tournament = ?;";
    return new Promise((resolve, reject) => {
      connection.query(query, [tournamentId], function(err, rows, fields) {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },
  updateTeam: (connection, id, teamName, leader, tournament, paid, seed) => {
    const query =
      "UPDATE teams SET teamName = ?, leader = ?, tournament = ?, paid = ?, seed = ? WHERE id = ?;";
    return new Promise((resolve, reject) => {
      connection.query(
        query,
        [teamName, leader, tournament, paid, seed, id],
        function(err, rows, fields) {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  },
  deleteTeam: (connection, id) => {
    const query = "DELETE FROM teams WHERE id = ?;";
    return new Promise((resolve, reject) => {
      connection.query(query, [id], function(err, rows, fields) {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },
  createTeamMember: (
    connection,
    userEmail,
    teamId,
    invited = false,
    requested = false,
    approved = false
  ) => {
    const query =
      "INSERT INTO teamMembers(userEmail, teamId, invited, requested, approved) VALUES(?, ?, ?, ?, ?)";
    return new Promise((resolve, reject) => {
      connection.query(
        query,
        [userEmail, teamId, invited, requested, approved],
        function(err, rows, fields) {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  },
  updateTeamMember: (
    connection,
    userEmail,
    teamId,
    invited,
    requested,
    approved
  ) => {
    const query =
      "UPDATE teamMembers SET invited = ?, requested = ?, approved = ? WHERE userEmail = ? AND teamId = ?;";
    return new Promise((resolve, reject) => {
      connection.query(
        query,
        [invited, requested, approved, userEmail, teamId],
        function(err, rows, fields) {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  },
  deleteTeamMember: (connection, userEmail, teamId) => {
    const query = "DELETE FROM teamMembers WHERE userEmail = ? AND teamId = ?;";
    return new Promise((resolve, reject) => {
      connection.query(query, [userEmail, teamId], function(err, rows, fields) {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },
  getTeamMember: (connection, teamId, userEmail) => {
    const query = "SELECT * FROM teamMembers WHERE teamId = ? AND userEmail = ?;";
    return new Promise((resolve, reject) => {
      connection.query(query, [teamId, userEmail], function(err, rows, fields) {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },
  getTeamMembers: (connection, teamId) => {
    const query = "SELECT * FROM teamMembers WHERE teamId = ?;";
    return new Promise((resolve, reject) => {
      connection.query(query, [teamId], function(err, rows, fields) {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },
  getTeamsWithTeamMembers: (connection, tournamentId, numParticipants) => {
    const query = `SELECT
      COUNT(*) AS 'numMembers',
      teams.*
      FROM teamMembers
      LEFT JOIN teams ON teams.id = teamMembers.teamId
      WHERE teams.tournament = ? AND teamMembers.approved = TRUE
      GROUP BY teamId
      HAVING numMembers = ? AND paid = TRUE
      ORDER BY seed DESC;`;
    return new Promise((resolve, reject) => {
      connection.query(query, [tournamentId, numParticipants], function(
        err,
        rows,
        fields
      ) {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
};
