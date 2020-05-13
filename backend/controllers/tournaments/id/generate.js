"use strict";

const express = require("express");
const router = express.Router();
const sqlwrapper = require("../../../model/wrapper");

router.post("/", async function(req, res, next) {
  try {
    const c = req.app.get("databaseConnection");
    const tournamentObject = await sqlwrapper.getTournament(
      c,
      req.headers.tournamentid
    );
    if (!tournamentObject[0]) {
      const err = new Error("Tournament does not exist!");
      err.status = 404;
      next(err);
      return;
    }
    if (req.headers.id === tournamentObject[0].creator) {
      const validTeams = await sqlwrapper.getTeamsWithTeamMembers(
        c,
        tournamentObject[0].id,
        tournamentObject[0].maxTeamSize
      );
      if (validTeams.length < 2) {
        const err = new Error("Not enough teams to generate a valid bracket!");
        err.status = 400;
        next(err);
      } else {
        if (tournamentObject[0].tournamentType === "Single Elim") {
          await generateSingleElimBracket(
            c,
            validTeams,
            tournamentObject[0].id
          );
        } else if (tournamentObject[0].tournamentType === "Double Elim") {
          const err = new Error("Bracket type does not exist!");
          err.status = 400;
          next(err);
        } else if (tournamentObject[0].tournamentType === "Round-robin") {
          await generateRoundRobinMatches(
            c,
            validTeams,
            tournamentObject[0].id
          );
        } else {
          const err = new Error("Bracket type does not exist!");
          err.status = 400;
          next(err);
          return;
        }
        // Generate match location and times
        let locations = tournamentObject[0].location.split(",")
        let matches = await sqlwrapper.getMatches(c, req.headers.tournamentid);
        // TODO Hardcode each match to 2 hours, this should be adjustable in the future
        // TODO lots of assumptions made about match time generation, should fix algorithm to be recursive
        const timePerMatch = 2 * 60 * 60 * 1000;
        matches.forEach(async (match, i, arr) => {
          let teamA = match.teamA;
          let teamB = match.teamB;
          if (teamA) {
            teamA = teamA.teamId;
          }
          if (teamB) {
            teamB = teamB.teamId;
          }
          let matchTime = new Date(tournamentObject[0].startDate.valueOf() + (Math.floor(i / locations.length) * timePerMatch));
          if (match.feederA || match.feederB) {
            let matchA = null;
            let matchB = null;
            if (match.feederA) {
              matchA = arr.find((m) => {
                return m.id === match.feederA;
              });
            }
            if (match.feederB) {
              matchB = arr.find((m) => {
                return m.id === match.feederB;
              });
            }
            if (matchA && !matchB) {
              matchTime = new Date(matchA.matchTime.valueOf() + timePerMatch);
            } else if (matchB && !matchA) {
              matchTime = new Date(matchB.matchTime.valueOf() + timePerMatch);
            } else if (matchA.matchTime > matchB.matchTime) {
              matchTime = new Date(matchA.matchTime.valueOf() + timePerMatch);
            } else {
              matchTime = new Date(matchB.matchTime.valueOf() + timePerMatch);
            }
          }
          arr[i].matchTime = matchTime;
          await sqlwrapper.updateMatch(c, match.id, locations[i % locations.length], match.winner, matchTime, match.matchName, teamA, teamB, match.feederA, match.feederB, match.scoreA, match.scoreB, match.feederAIsLoser, match.feederBIsLoser);
        });
        res.status(200);
        res.json({ generationSuccess: true });
      }
    } else {
      const err = new Error("You cannot generate matches for this tournament!");
      err.status = 401;
      next(err);
    }
  } catch (err) {
    next(err);
  }
});

async function generateSingleElimBracket(c, teams, tournamentId) {
  const teamsCopy = teams.slice(0);
  while (!isPowerOfTwo(teamsCopy.length)) {
    teamsCopy.push(null);
  }
  let currentMatchups = await generateMatchLayerFromTeams(
    c,
    teamsCopy,
    tournamentId
  );
  while (currentMatchups.length !== 1) {
    currentMatchups = await generateMatchLayer(
      c,
      currentMatchups,
      tournamentId
    );
  }
}

async function generateRoundRobinMatches(c, teams, tournamentId) {
  for (let i = 0; i < teams.length - 1; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      const match = {
        id: null,
        location: null,
        winner: 0,
        matchTime: null,
        matchName: null,
        tournament: tournamentId,
        teamA: null,
        teamB: null,
        feederA: null,
        feederB: null,
        scoreA: null,
        scoreB: null,
        feederAIsLoser: false,
        feederBIsLoser: false
      };
      match.teamA = teams[i].id;
      match.teamB = teams[j].id;
      const teamA = (await sqlwrapper.getTeam(c, match.teamA))[0];
      const teamB = (await sqlwrapper.getTeam(c, match.teamB))[0];
      match.matchName = teamA.teamName + " vs " + teamB.teamName;
      await sqlwrapper.createMatch(
        c,
        match.location,
        match.winner,
        match.matchTime,
        match.matchName,
        match.tournament,
        match.teamA,
        match.teamB,
        match.feederA,
        match.feederB,
        match.scoreA,
        match.scoreB,
        match.feederAIsLoser,
        match.feederBIsLoser
      );
    }
  }
}

async function generateMatchLayer(connection, matches, tournamentId) {
  const nextLayer = [];
  for (let x = 0; x < Math.floor(matches.length / 2); x++) {
    const match = {
      id: null,
      location: null,
      winner: 0,
      matchTime: null,
      matchName: null,
      tournament: tournamentId,
      teamA: null,
      teamB: null,
      feederA: null,
      feederB: null,
      scoreA: null,
      scoreB: null,
      feederAIsLoser: false,
      feederBIsLoser: false
    };
    match.feederA = matches[x].id;
    match.feederB = matches[matches.length - (x + 1)].id;
    let teamAName = "Winner of Match " + match.feederA;
    let teamBName = "Winner of Match " + match.feederB;
    if (matches[x].winner !== 0) {
      if (matches[x].winner === 1) {
        match.teamA = matches[x].teamA;
      } else {
        match.teamA = matches[x].teamB;
      }
      teamAName = match.teamA.teamName;
    }
    if (matches[matches.length - (x + 1)].winner !== 0) {
      if (matches[matches.length - (x + 1)].winner === 1) {
        match.teamB = matches[matches.length - (x + 1)].teamA;
      } else {
        match.teamB = matches[matches.length - (x + 1)].teamB;
      }
      teamBName = match.teamB.teamName;
    }
    match.matchName = teamAName + " vs " + teamBName;
    let teamAId = null;
    let teamBId = null;
    if (match.teamA) {
      teamAId = match.teamA.teamId;
    }
    if (match.teamB) {
      teamBId = match.teamB.teamId;
    }
    const created = await sqlwrapper.createMatch(
      connection,
      match.location,
      match.winner,
      match.matchTime,
      match.matchName,
      match.tournament,
      teamAId,
      teamBId,
      match.feederA,
      match.feederB,
      match.scoreA,
      match.scoreB,
      match.feederAIsLoser,
      match.feederBIsLoser
    );
    match.id = created.insertId;
    nextLayer.push(match);
  }
  return nextLayer;
}

async function generateMatchLayerFromTeams(connection, teams, tournamentId) {
  const matches = [];
  for (let x = 0; x < Math.floor(teams.length / 2); x++) {
    const match = {
      id: null,
      location: null,
      winner: 0,
      matchTime: null,
      matchName: null,
      tournament: tournamentId,
      teamA: null,
      teamB: null,
      feederA: null,
      feederB: null,
      scoreA: null,
      scoreB: null,
      feederAIsLoser: false,
      feederBIsLoser: false
    };
    if (teams[x]) {
      match.teamA = teams[x].id;
    }
    if (teams[teams.length - (x + 1)]) {
      match.teamB = teams[teams.length - (x + 1)].id;
    }
    let teamAObject = null;
    let teamBObject = null;
    if (match.teamB === null) {
      // Set the winner to the first team
      match.winner = 1;
      const teamA = (await sqlwrapper.getTeam(connection, match.teamA))[0];
      teamAObject = {
        teamId: teamA.id,
        teamName: teamA.teamName
      };
      match.matchName = "BYE for " + teamA.teamName;
    } else {
      const teamA = (await sqlwrapper.getTeam(connection, match.teamA))[0];
      const teamB = (await sqlwrapper.getTeam(connection, match.teamB))[0];
      teamAObject = {
        teamId: teamA.id,
        teamName: teamA.teamName
      };
      teamBObject = {
        teamId: teamB.id,
        teamName: teamB.teamName
      };
      match.matchName = teamA.teamName + " vs " + teamB.teamName;
    }
    const created = await sqlwrapper.createMatch(
      connection,
      match.location,
      match.winner,
      match.matchTime,
      match.matchName,
      match.tournament,
      match.teamA,
      match.teamB,
      match.feederA,
      match.feederB,
      match.scoreA,
      match.scoreB,
      match.feederAIsLoser,
      match.feederBIsLoser
    );
    match.id = created.insertId;
    match.teamA = teamAObject;
    match.teamB = teamBObject;
    matches.push(match);
  }
  return matches;
}

function isPowerOfTwo(n) {
  return n > 0 && (n & (n - 1)) === 0;
}

module.exports = router;
