import * as errors from "./errors";
import Authentication from "./Authentication";
import Config from "./APIConfig";

export const ScoringTypes = {
  POINTS: "points",
  SETS: "sets",
  ETC: "etc" // ?
};

export const TournamentTypes = {
  SINGLE_ELIM: "single elim",
  DOUBLE_ELIM: "double elim",
  ROUND_ROBIN: "round-robin",
  ETC: "etc" // ?
};

export default class TournamentAPI {
  static async createTournament(
    tournamentName,
    description,
    maxTeamSize,
    location,
    scoringType,
    tournamentType,
    entryCost,
    maxTeams,
    startDate,
    endDate
  ) {
    if (!Authentication.loggedIn()) return;
    const res = await fetch(`${Config.base_url}/tournaments/create`, {
      method: "POST",
      headers: Authentication.withJWT(),
      body: JSON.stringify({
        tournamentName,
        description,
        maxTeamSize,
        location,
        scoringType,
        tournamentType,
        entryCost,
        maxTeams,
        startDate,
        endDate
      })
    });

    if (res.ok) {
      const json = await res.json();
      return json.tournamentId;
    } else {
      throw new errors.UnexpectedError();
    }
  }

  static async editTournament(
    tournamentId,
    tournamentName,
    description,
    maxTeamSize,
    location,
    scoringType,
    tournamentType,
    entryCost,
    maxTeams,
    startDate,
    endDate
  ) {
    if (!Authentication.loggedIn()) return;
    const res = await fetch(`${Config.base_url}/tournaments/edit`, {
      method: "POST",
      headers: Authentication.withJWT(),
      body: JSON.stringify({
        tournamentId,
        tournamentName,
        description,
        maxTeamSize,
        location,
        scoringType,
        tournamentType,
        entryCost,
        maxTeams,
        startDate,
        endDate
      })
    });

    if (!res.ok) {
      throw new errors.UnexpectedError();
    }
    const json = await res.json();
    return json.tournamentId;
  }

  static async deleteTournament(tournamentId) {
    if (!Authentication.loggedIn()) return;
    const res = await fetch(`${Config.base_url}/tournaments/delete`, {
      method: "POST",
      headers: Authentication.withJWT(),
      body: JSON.stringify({ tournamentId })
    });

    if (!res.ok) {
      throw new errors.UnexpectedError();
    }
    const json = await res.json();
    return json.deleteStatus;
  }

  static async getTournaments() {
    const res = await fetch(`${Config.base_url}/tournaments`, {
      method: "GET",
      headers: Authentication.withoutJWT()
    });

    if (!res.ok) {
      throw new errors.UnexpectedError();
    }
    const json = await res.json();
    return json.tournaments;
  }

  static async getTournament(id) {
    const res = await fetch(`${Config.base_url}/tournaments/id/${id}`, {
      method: "GET",
      headers: Authentication.withoutJWT()
    });

    if (!res.ok) {
      throw new errors.UnexpectedError();
    }
    const json = await res.json();
    return json.tournament;
  }

  static async searchTournaments(search, filter = {}) {
    if (!Authentication.loggedIn()) return;
    const res = await fetch(`${Config.base_url}/tournaments/search`, {
      method: "POST",
      headers: Authentication.withJWT(),
      body: JSON.stringify({ search, filter })
    });

    if (!res.ok) {
      throw new errors.UnexpectedError();
    }
    const json = await res.json();
    return json.tournamentId;
  }

  static async generateBracket(tournamentId) {
    if (!Authentication.loggedIn()) return;
    const res = await fetch(
      `${Config.base_url}/tournaments/id/${tournamentId}/generate`,
      {
        method: "POST",
        headers: Authentication.withJWT()
      }
    );
    if (res.ok) {
      const json = await res.json();
      return json.generationSuccess;
    } else {
      throw new errors.UnexpectedError();
    }
  }
}
