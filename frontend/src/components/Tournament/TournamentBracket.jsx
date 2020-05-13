import React from "react";
import { withRouter } from "react-router-dom";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Bracket } from "react-tournament-bracket";

function makeMatchesObject(matchesList) {
  const rootMatch = getRootMatch(matchesList);
  const idToMatch = mapIdToMatch(matchesList);
  function sideHelper(team, score, feeder) {
    const side = {};
    if (team) {
      side.team = {
        id: String(team.teamId),
        name: String(team.teamName)
      };
    }
    if (score != null) {
      side.score = { score };
    }
    const match = idToMatch.get(feeder);
    if (
      feeder &&
      (match.feederA || match.feederB || (match.teamA && match.teamB))
    ) {
      const match = idToMatch.get(feeder);
      side.seed = {
        rank: 1,
        sourceGame: helper(match)
      };
    }
    return side;
  }
  function helper(match) {
    const home = sideHelper(match.teamA, match.scoreA, match.feederA);
    const visitor = sideHelper(match.teamB, match.scoreB, match.feederB);
    const game = {
      id: String(match.id),
      name: String(match.matchName),
      scheduled: Date.parse(match.matchTime),
      court: {
        name: match.location,
        venue: { name: match.location }
      },
      sides: { home, visitor }
    };
    return game;
  }
  return helper(rootMatch);
}

function getRootMatch(matchesList) {
  const matchesWithParents = new Set();
  for (const { feederA, feederB } of matchesList) {
    if (feederA) matchesWithParents.add(feederA);
    if (feederB) matchesWithParents.add(feederB);
  }
  for (const match of matchesList) {
    if (!matchesWithParents.has(match.id)) {
      return match;
    }
  }
  return undefined;
}

function mapIdToMatch(matchesList) {
  const mapping = new Map();
  for (const match of matchesList) {
    mapping.set(match.id, match);
  }
  return mapping;
}

function isRoundRobin(matchesList) {
  for (const match of matchesList) {
    if (match.feederA || match.feederB) {
      return false;
    }
  }
  return true;
}

class TournamentBracket extends React.Component {
  renderBracket() {
    const { matchesList } = this.props;
    if (matchesList.length > 0 && !isRoundRobin(matchesList)) {
      const matchesObject = makeMatchesObject(matchesList);
      return <Bracket game={matchesObject} />;
    }
    if (matchesList.length > 0 && isRoundRobin(matchesList)) {
      const teamResults = {};
      for (const match of matchesList) {
        const teamA = match.teamA.teamName;
        const teamB = match.teamB.teamName;
        teamResults[teamA] = teamResults[teamA] || {};
        teamResults[teamB] = teamResults[teamB] || {};
        if (match.winner === 1) {
          teamResults[teamA][teamB] = true;
          teamResults[teamB][teamA] = false;
        } else if (match.winner === 2) {
          teamResults[teamA][teamB] = false;
          teamResults[teamB][teamA] = true;
        }
      }
      const teams = Object.keys(teamResults);
      return (
        <Paper>
          <Table>
            <TableHead>
              <TableCell />
              {teams.map(team => (
                <TableCell key={team}>vs. {team}</TableCell>
              ))}
            </TableHead>
            <TableBody>
              {teams.map(teamA => (
                <TableRow key={teamA}>
                  <TableCell>{teamA}</TableCell>
                  {teams.map(
                    teamB =>
                      teamA !== teamB ? (
                        <TableCell key={teamB}>
                          <strong>
                            {(() => {
                              if (teamResults[teamA][teamB] === true) {
                                return "Win";
                              }
                              if (teamResults[teamA][teamB] === false) {
                                return "Lose";
                              }
                              return "Pending";
                            })()}
                          </strong>{" "}
                          vs {teamB}
                        </TableCell>
                      ) : (
                        <TableCell />
                      )
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      );
    }
    return <h1>No Matches</h1>;
  }

  render() {
    try {
      return this.renderBracket();
    } catch (error) {
      return <h1>Error displaying tournament bracket</h1>;
    }
  }
}

export default withRouter(TournamentBracket);
