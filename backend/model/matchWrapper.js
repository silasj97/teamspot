"use strict";

const teamWrapper = require("./teamWrapper");

function createMatch(
  connection,
  location = null,
  winner = null,
  matchTime = null,
  matchName = null,
  tournament,
  teamA = null,
  teamB = null,
  feederA = null,
  feederB = null,
  scoreA = null,
  scoreB = null,
  feederAIsLoser = false,
  feederBIsLoser = false
) {
  const query =
    "INSERT INTO matches(location, winner, matchTime, matchName, tournament, teamA, teamB, feederA, feederB, scoreA, scoreB, feederAIsLoser, feederBIsLoser) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
  return new Promise((resolve, reject) => {
    connection.query(
      query,
      [
        location,
        winner,
        matchTime,
        matchName,
        tournament,
        teamA,
        teamB,
        feederA,
        feederB,
        scoreA,
        scoreB,
        feederAIsLoser,
        feederBIsLoser
      ],
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

function getMatch(connection, id) {
  const query =
    "SELECT m.*, t.teamName AS 'teamAName', t1.teamName AS 'teamBName' FROM matches m LEFT JOIN teams t1 ON m.teamB = t1.id LEFT JOIN teams t ON m.teamA = t.id WHERE m.id = ?;";
  return new Promise((resolve, reject) => {
    connection.query(query, [id], async function(err, rows, fields) {
      if (err) {
        reject(err);
      } else {
        const matches = [];
        let teamAObject = null;
        let teamBObject = null;
        const teamA = (await teamWrapper.getTeam(connection, rows[0].teamA))[0];
        const teamB = (await teamWrapper.getTeam(connection, rows[0].teamB))[0];
        if (teamA) {
          teamAObject = {
            teamId: teamA.id,
            teamName: teamA.teamName
          };
        }
        if (teamB) {
          teamBObject = {
            teamId: teamB.id,
            teamName: teamB.teamName
          };
        }
        const match = {
          id: rows[0].id,
          location: rows[0].location,
          winner: rows[0].winner,
          matchTime: rows[0].matchTime,
          matchName: rows[0].matchName,
          tournament: rows[0].tournament,
          teamA: teamAObject,
          teamB: teamBObject,
          feederA: rows[0].feederA,
          feederB: rows[0].feederB,
          scoreA: rows[0].scoreA,
          scoreB: rows[0].scoreB,
          feederAIsLoser: rows[0].feederAIsLoser,
          feederBIsLoser: rows[0].feederBIsLoser
        };
        matches.push(match);
        resolve(matches);
      }
    });
  });
}

function getPublishedMatch(connection, id) {
  const query =
    "SELECT m.*, t.teamName AS 'teamAName', t1.teamName AS 'teamBName' FROM matches m LEFT JOIN teams t1 ON m.teamB = t1.id LEFT JOIN teams t ON m.teamA = t.id WHERE m.id = ? AND publish = 1;";
  return new Promise((resolve, reject) => {
    connection.query(query, [id], async function(err, rows, fields) {
      if (err) {
        reject(err);
      } else {
        const matches = [];
        let teamAObject = null;
        let teamBObject = null;
        const teamA = (await teamWrapper.getTeam(connection, rows[0].teamA))[0];
        const teamB = (await teamWrapper.getTeam(connection, rows[0].teamB))[0];
        if (teamA) {
          teamAObject = {
            teamId: teamA.id,
            teamName: teamA.teamName
          };
        }
        if (teamB) {
          teamBObject = {
            teamId: teamB.id,
            teamName: teamB.teamName
          };
        }
        const match = {
          id: rows[0].id,
          location: rows[0].location,
          winner: rows[0].winner,
          matchTime: rows[0].matchTime,
          matchName: rows[0].matchName,
          tournament: rows[0].tournament,
          teamA: teamAObject,
          teamB: teamBObject,
          feederA: rows[0].feederA,
          feederB: rows[0].feederB,
          scoreA: rows[0].scoreA,
          scoreB: rows[0].scoreB,
          feederAIsLoser: rows[0].feederAIsLoser,
          feederBIsLoser: rows[0].feederBIsLoser
        };
        matches.push(match);
        resolve(matches);
      }
    });
  });
}

function updateMatch(
  connection,
  id,
  location,
  winner,
  matchTime,
  matchName,
  teamA,
  teamB,
  feederA,
  feederB,
  scoreA,
  scoreB,
  feederAIsLoser = false,
  feederBIsLoser = false
) {
  const query =
    "UPDATE matches SET location = ?, winner = ?, matchTime = ?, matchName = ?, teamA = ?, teamB = ?, feederA = ?, feederB = ?, scoreA = ?, scoreB = ?, feederAIsLoser = ?, feederBIsLoser = ? WHERE id = ?;";
  return new Promise((resolve, reject) => {
    connection.query(
      query,
      [
        location,
        winner,
        matchTime,
        matchName,
        teamA,
        teamB,
        feederA,
        feederB,
        scoreA,
        scoreB,
        feederAIsLoser,
        feederBIsLoser,
        id
      ],
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

function updateMatchField(connection, id, fieldName, fieldValue) {
  const query = "UPDATE matches SET ?? = ? WHERE id = ?;";
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

function deleteMatch(connection, id) {
  const query = "DELETE FROM matches WHERE id = ?;";
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

function getMatches(connection, tournamentId) {
  const query =
    "SELECT m.*, t.teamName AS 'teamAName', t1.teamName AS 'teamBName' FROM matches m LEFT JOIN teams t1 ON m.teamB = t1.id LEFT JOIN teams t ON m.teamA = t.id WHERE m.tournament = ? ORDER BY matchTime ASC, id ASC;";
  return new Promise((resolve, reject) => {
    connection.query(query, [tournamentId], async function(err, rows, fields) {
      if (err) {
        reject(err);
      } else {
        const matches = [];
        for (let i = 0; i < rows.length; i++) {
          let teamAObject = null;
          let teamBObject = null;
          const teamA = (await teamWrapper.getTeam(
            connection,
            rows[i].teamA
          ))[0];
          const teamB = (await teamWrapper.getTeam(
            connection,
            rows[i].teamB
          ))[0];
          if (teamA) {
            teamAObject = {
              teamId: teamA.id,
              teamName: teamA.teamName
            };
          }
          if (teamB) {
            teamBObject = {
              teamId: teamB.id,
              teamName: teamB.teamName
            };
          }
          const match = {
            id: rows[i].id,
            location: rows[i].location,
            winner: rows[i].winner,
            matchTime: rows[i].matchTime,
            matchName: rows[i].matchName,
            tournament: rows[i].tournamentId,
            teamA: teamAObject,
            teamB: teamBObject,
            feederA: rows[i].feederA,
            feederB: rows[i].feederB,
            scoreA: rows[i].scoreA,
            scoreB: rows[i].scoreB,
            feederAIsLoser: rows[i].feederAIsLoser,
            feederBIsLoser: rows[i].feederBIsLoser
          };
          matches.push(match);
        }
        resolve(matches);
      }
    });
  });
}

function getPublishedMatches(connection, tournamentId) {
  const query =
    "SELECT m.*, t.teamName AS 'teamAName', t1.teamName AS 'teamBName' FROM matches m LEFT JOIN teams t1 ON m.teamB = t1.id LEFT JOIN teams t ON m.teamA = t.id WHERE m.tournament = ? AND publish = 1 ORDER BY matchTime ASC, id ASC;";
  return new Promise((resolve, reject) => {
    connection.query(query, [tournamentId], async function(err, rows, fields) {
      if (err) {
        reject(err);
      } else {
        const matches = [];
        for (let i = 0; i < rows.length; i++) {
          let teamAObject = null;
          let teamBObject = null;
          const teamA = (await teamWrapper.getTeam(
            connection,
            rows[i].teamA
          ))[0];
          const teamB = (await teamWrapper.getTeam(
            connection,
            rows[i].teamB
          ))[0];
          if (teamA) {
            teamAObject = {
              teamId: teamA.id,
              teamName: teamA.teamName
            };
          }
          if (teamB) {
            teamBObject = {
              teamId: teamB.id,
              teamName: teamB.teamName
            };
          }
          const match = {
            id: rows[i].id,
            location: rows[i].location,
            winner: rows[i].winner,
            matchTime: rows[i].matchTime,
            matchName: rows[i].matchName,
            tournament: rows[i].tournamentId,
            teamA: teamAObject,
            teamB: teamBObject,
            feederA: rows[i].feederA,
            feederB: rows[i].feederB,
            scoreA: rows[i].scoreA,
            scoreB: rows[i].scoreB,
            feederAIsLoser: rows[i].feederAIsLoser,
            feederBIsLoser: rows[i].feederBIsLoser
          };
          matches.push(match);
        }
        resolve(matches);
      }
    });
  });
}

function getDependentMatches(connection, matchId) {
  const query = "SELECT * FROM matches WHERE feederA = ? OR feederB = ?;";
  return new Promise((resolve, reject) => {
    connection.query(query, [matchId, matchId], function(err, rows, fields) {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

async function reloadMatches(connection, matchId) {
  const matches = await getDependentMatches(connection, matchId);
  const updatedMatch = await getMatch(connection, matchId);
  let winner;
  let loser;
  if (updatedMatch[0].winner === 1) {
    winner = updatedMatch[0].teamA.teamId;
    loser = updatedMatch[0].teamB.teamId;
  } else if (updatedMatch[0].winner === 2) {
    winner = updatedMatch[0].teamB.teamId;
    loser = updatedMatch[0].teamA.teamId;
  } else {
    return;
  }
  try {
    for (let i = 0; i < matches.length; i++) {
      if (parseInt(matches[i].feederA, 10) === parseInt(matchId, 10)) {
        if (matches[i].feederAIsLoser === 1) {
          updateMatchField(connection, matches[i].id, "teamA", loser);
        } else {
          updateMatchField(connection, matches[i].id, "teamA", winner);
        }
      } else {
        // eslint-ignore-next-line
        if (matches[i].feederBIsLoser === 1) {
          updateMatchField(connection, matches[i].id, "teamB", loser);
        } else {
          updateMatchField(connection, matches[i].id, "teamB", winner);
        }
      }
      const updatedMatch = (await getMatch(connection, matches[i].id))[0];
      if (updatedMatch.teamA && updatedMatch.teamB) {
        const updatedMatchName =
          updatedMatch.teamA.teamName + " vs " + updatedMatch.teamB.teamName;
        updateMatchField(
          connection,
          matches[i].id,
          "matchName",
          updatedMatchName
        );
      }
    }
    return true;
  } catch (err) {
    return false;
  }
}

module.exports = {
  createMatch: createMatch,
  getMatch: getMatch,
  getPublishedMatch: getPublishedMatch,
  updateMatch: updateMatch,
  updateMatchField: updateMatchField,
  deleteMatch: deleteMatch,
  getMatches: getMatches,
  getPublishedMatches: getPublishedMatches,
  getDependentMatches: getDependentMatches,
  reloadMatches: reloadMatches
};
