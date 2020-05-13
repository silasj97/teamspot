"use strict";

function createTeam(
  connection,
  teamName = null,
  leader,
  tournament,
  paid = false,
  seed = null
) {
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
}

function getTeam(connection, id) {
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
}

function getTeams(connection, tournamentId) {
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
}

function updateTeam(connection, id, teamName, leader, tournament, paid, seed) {
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
}

function updateTeamField(connection, id, fieldName, fieldValue) {
  const query = "UPDATE teams SET ? = ? WHERE id = ?;";
  return new Promise((resolve, reject) => {
    connection.query(query, [fieldName, fieldValue, id], function(
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

function deleteTeam(connection, id) {
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
}

function createTeamMember(
  connection,
  userEmail,
  teamId,
  invited = false,
  requested = false,
  approved = false
) {
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
}

function updateTeamMember(
  connection,
  userEmail,
  teamId,
  invited,
  requested,
  approved
) {
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
}

function deleteTeamMember(connection, userEmail, teamId) {
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
}

function getTeamMember(connection, teamId, userEmail) {
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
}

function getTeamMembers(connection, teamId) {
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
}

function getApprovedTeamMembers(connection, teamId) {
  const query =
    "SELECT * FROM teamMembers WHERE teamId = ? AND approved = TRUE;";
  return new Promise((resolve, reject) => {
    connection.query(query, [teamId], function(err, rows, fields) {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function getTeamsWithTeamMembers(connection, tournamentId, numParticipants) {
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

function getInvites(connection, userEmail) {
  const query =
    "SELECT * FROM teamMembers WHERE userEmail = ? AND approved = FALSE AND invited = TRUE;";
  return new Promise((resolve, reject) => {
    connection.query(query, [userEmail], function(err, rows, fields) {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

module.exports = {
  createTeam: createTeam,
  getTeam: getTeam,
  getTeams: getTeams,
  updateTeam: updateTeam,
  updateTeamField: updateTeamField,
  deleteTeam: deleteTeam,
  createTeamMember: createTeamMember,
  updateTeamMember: updateTeamMember,
  deleteTeamMember: deleteTeamMember,
  getTeamMember: getTeamMember,
  getTeamMembers: getTeamMembers,
  getApprovedTeamMembers: getApprovedTeamMembers,
  getTeamsWithTeamMembers: getTeamsWithTeamMembers,
  getInvites: getInvites
};
