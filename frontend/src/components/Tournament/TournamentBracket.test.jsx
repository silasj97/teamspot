import React from "react";
import { shallow } from "enzyme";
import TournamentBracket from "components/Tournament/TournamentBracket";

const adverbs = [
  "Crushing",
  "Stinging",
  "Scratching",
  "Smashing",
  "Stomping",
  "Yodeling",
  "Oofing",
  "REEEEEing"
];
const nouns = [
  "Yellow Jackets",
  "Bulldogs",
  "Canaries",
  "Chads",
  "Big Chads",
  "Oofs",
  "REEEEEs"
];
const locations = ["ULC", "CULC", "Curran", "CRC"];

const randInt = n => Math.trunc(Math.random() * n);
let nextId = 1;
const uniqueId = () => nextId++;
const pickRandom = array => array[randInt(array.length)];

function mockMatch(teamA, teamB, feederA, feederB) {
  const score = randInt(5);
  const diff = (1 + randInt(2)) * (Math.random() > 0.5 ? 1 : -1);
  return {
    teamA,
    teamB,
    feederA,
    feederB,
    scoreA: Math.max(0, score + diff),
    scoreB: Math.max(0, score - diff),
    id: uniqueId(),
    location: pickRandom(locations),
    matchTime: new Date().toISOString(),
    matchName: "<MatchName>",
    tournament: 1,
    published: true
  };
}

function mockTeam() {
  return {
    teamId: uniqueId(),
    teamName: `The ${pickRandom(adverbs)} ${pickRandom(nouns)}`
  };
}

function mockFirstRound(teams) {
  teams = teams.slice();
  const matches = [];
  while (teams.length > 0) {
    const [teamA, teamB] = teams.splice(0, 2);
    const match = mockMatch(teamA, teamB);
    matches.push(match);
  }
  return matches;
}

function getWinner(match) {
  return match.scoreA > match.scoreB ? match.teamA : match.teamB;
}

function mockRound(previousMatches) {
  previousMatches = previousMatches.slice();
  const matches = [];
  while (previousMatches.length > 0) {
    const [matchA, matchB] = previousMatches.splice(0, 2);
    const teamA = getWinner(matchA);
    const teamB = getWinner(matchB);
    const match = mockMatch(teamA, teamB, matchA.id, matchB.id);
    matches.push(match);
  }
  return matches;
}

function mockMatches(numberOfTeams = 16) {
  const teams = Array(numberOfTeams)
    .fill(null)
    .map(mockTeam);
  const rounds = [];
  rounds.push(mockFirstRound(teams));
  while (rounds[rounds.length - 1].length > 1) {
    const matches = mockRound(rounds[rounds.length - 1]);
    rounds.push(matches);
  }
  return rounds.flat();
}

it("converts to object for bracket display", () => {
  const wrapper = shallow(<TournamentBracket matchesList={mockMatches()} />);
});
