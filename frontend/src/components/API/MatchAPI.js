import * as errors from "./errors";
import Authentication from "./Authentication";
import Config from "./APIConfig";

export default class MatchAPI {
  static async createMatch(
    tournament,
    location,
    matchName,
    matchTime,
    teamA,
    teamB,
    feederA,
    feederB
  ) {
    if (!Authentication.loggedIn()) return;
    const res = await fetch(`${Config.base_url}/matches/create`, {
      method: "POST",
      headers: Authentication.withJWT(),
      body: JSON.stringify({
        tournament,
        location,
        matchName,
        matchTime,
        teamA,
        teamB,
        feederA,
        feederB
      })
    });

    if (res.ok) {
      const json = await res.json();
      return json.matchId;
    } else {
      throw new errors.UnexpectedError();
    }
  }

  static async editMatch(
    matchId,
    location,
    matchName,
    matchTime,
    teamA,
    teamB,
    feederA,
    feederB
  ) {
    if (!Authentication.loggedIn()) return;
    const res = await fetch(`${Config.base_url}/matches/edit`, {
      method: "POST",
      headers: Authentication.withJWT(),
      body: JSON.stringify({
        matchId,
        location,
        matchName,
        matchTime,
        teamA,
        teamB,
        feederA,
        feederB
      })
    });

    if (res.ok) {
      const json = await res.json();
      return json.matchId;
    } else {
      throw new errors.UnexpectedError();
    }
  }

  static async deleteMatch(matchId) {
    if (!Authentication.loggedIn()) return;
    const res = await fetch(`${Config.base_url}/matches/delete`, {
      method: "POST",
      headers: Authentication.withJWT(),
      body: JSON.stringify({
        matchId
      })
    });

    if (res.ok) {
      const json = await res.json();
      return json.deleteStatus;
    } else {
      throw new errors.UnexpectedError();
    }
  }

  static async publishMatch(matchId, publish) {
    if (!Authentication.loggedIn()) return;
    const res = await fetch(`${Config.base_url}/matches/publish`, {
      method: "POST",
      headers: Authentication.withJWT(),
      body: JSON.stringify({
        matchId,
        publish
      })
    });

    if (res.ok) {
      const json = await res.json();
      return json.publishStatus;
    } else {
      throw new errors.UnexpectedError();
    }
  }

  static async getMatches(tournamentID) {
    let authHeader;
    if (Authentication.loggedIn()) {
      authHeader = Authentication.withJWT();
    } else {
      authHeader = Authentication.withoutJWT();
    }
    const res = await fetch(
      `${Config.base_url}/tournaments/id/${tournamentID}/matches/`,
      {
        method: "GET",
        headers: authHeader
      }
    );

    if (!res.ok) {
      throw new errors.UnexpectedError();
    }
    const json = await res.json();
    return json.matches;
  }

  static async getMatch(matchID) {
    let authHeader;
    if (Authentication.loggedIn()) {
      authHeader = Authentication.withJWT();
    } else {
      authHeader = Authentication.withoutJWT();
    }
    const res = await fetch(`${Config.base_url}/matches/id/${matchID}`, {
      method: "GET",
      headers: authHeader
    });

    if (!res.ok) {
      throw new errors.UnexpectedError();
    }
    const json = await res.json();
    return json.match;
  }

  static async submitMatchScore(matchID, scoreA, scoreB, winner) {
    if (!Authentication.loggedIn()) return;
    const res = await fetch(`${Config.base_url}/matches/id/${matchID}/submit`, {
      method: "POST",
      headers: Authentication.withJWT(),
      body: JSON.stringify({
        scoreA,
        scoreB,
        winner
      })
    });
    if (res.ok) {
      const json = await res.json();
      return json.scoreSubmitSuccess;
    } else {
      throw new errors.UnexpectedError();
    }
  }
}
