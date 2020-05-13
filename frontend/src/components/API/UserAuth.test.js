import UserAuth from "./UserAuth";
import Config from "./APIConfig";

const name = "George P. Burdell";
const email = "gburdell3@gatech.edu";
const password = "thwg1927";
const jwt = "<jwt>";
const newJwt = "<new jwt>";

let userAuth;
let storage;
beforeEach(() => {
  storage = new StorageMock();
  userAuth = new UserAuth(storage);
  fetch.resetMocks();
});

describe("login", () => {
  it("sends credentials", async () => {
    try {
      await userAuth.login(email, password);
    } catch (error) {
      // pass
    } finally {
      const [uri, request] = fetch.mock.calls[0];
      expect(uri).toEqual(`${Config.base_url}/user/login`);
      expect(request.method).toEqual("POST");
      expect(JSON.parse(request.body)).toEqual({ email, password });
    }
  });

  it("receives and sets a jwt token on validation", async () => {
    fetch.once(JSON.stringify({ jwt }));
    await userAuth.login(email, password);
    expect(storage.getItem("userToken")).toEqual(jwt);
    expect(userAuth.getToken()).toEqual(jwt);
  });

  it("responds to invalid credentials", async () => {
    fetch.once(JSON.stringify({ jwt }), { status: 401 });
    await expect(userAuth.login(email, password)).rejects.toHaveProperty(
      "name",
      "IncorrectLoginError"
    );
    expect(storage.getItem("userToken")).toBeUndefined();
    expect(userAuth.getToken()).toBeUndefined();
  });
});

describe("register", () => {
  it("sends registration", async () => {
    try {
      await userAuth.register(name, email, password);
    } catch (error) {
      // pass
    } finally {
      const [uri, request] = fetch.mock.calls[0];
      expect(uri).toEqual(`${Config.base_url}/user/register`);
      expect(request.method).toEqual("POST");
      expect(JSON.parse(request.body)).toEqual({ email, password, name });
    }
  });

  it("receives and sets a jwt token on validation", async () => {
    fetch.once(JSON.stringify({ jwt }));
    await userAuth.register(name, email, password);
    expect(storage.getItem("userToken")).toEqual(jwt);
    expect(userAuth.getToken()).toEqual(jwt);
  });

  it("responds to invalid registration", async () => {
    fetch.once("", { status: 409 });
    await expect(
      userAuth.register(name, email, password)
    ).rejects.toHaveProperty("name", "EmailRegisteredError");
    expect(storage.getItem("userToken")).toBeUndefined();
    expect(userAuth.getToken()).toBeUndefined();
  });
});

describe("renew", () => {
  beforeEach(() => {
    storage.setItem("userToken", jwt);
  });

  it("sends renewal", async () => {
    try {
      await userAuth.renew();
    } catch (error) {
      // pass
    } finally {
      const [uri, request] = fetch.mock.calls[0];
      expect(uri).toEqual(`${Config.base_url}/user/renew`);
      expect(request.method).toEqual("GET");
      expect(request.headers["Authorization"]).toEqual(`Bearer ${jwt}`);
    }
  });

  it("receives a new jwt token", async () => {
    fetch.once(JSON.stringify({ jwt: newJwt }));
    await userAuth.renew();
    expect(storage.getItem("userToken")).toEqual(newJwt);
    expect(userAuth.getToken()).toEqual(newJwt);
  });

  it("logs out on invalid renewal request", async () => {
    fetch.once("", { status: 403 });
    await userAuth.renew();
    expect(storage.getItem("userToken")).toBeUndefined();
    expect(userAuth.getToken()).toBeUndefined();
  });
});

it("logout", () => {
  storage.setItem("userToken", jwt);
  userAuth.logout();
  expect(storage.getItem("userToken")).toBeUndefined();
  expect(userAuth.getToken()).toBeUndefined();
});

it("loggedIn", () => {
  expect(userAuth.loggedIn()).toBe(false);
  storage.setItem("userToken", jwt);
  expect(userAuth.loggedIn()).toBe(true);
});

describe("tournaments", () => {
  beforeEach(() => {
    storage.setItem("userToken", jwt);
  });

  const tournamentId = 1;
  const name = "My Tournament";
  const maxTeamSize = 10;
  const location = "Georgia Tech";
  const scoringType = "points";
  const tournamentType = "round-robin";
  const entryCost = 10;
  const maxTeams = 32;
  const startDate = "2018-09-13T22:07:14.260Z";
  const tournament = {
    name,
    maxTeamSize,
    location,
    scoringType,
    tournamentType,
    entryCost,
    maxTeams,
    startDate
  };

  describe("createTournament", () => {
    it("sends a tournament creation request", async () => {
      try {
        await userAuth.createTournament(
          name,
          maxTeamSize,
          location,
          scoringType,
          tournamentType,
          entryCost,
          maxTeams,
          startDate
        );
      } catch (error) {
        // pass
      } finally {
        const [uri, request] = fetch.mock.calls[0];
        expect(uri).toEqual(`${Config.base_url}/tournaments/create`);
        expect(request.method).toEqual("POST");
        expect(request.headers["Authorization"]).toEqual(`Bearer ${jwt}`);
        expect(JSON.parse(request.body)).toEqual(tournament);
      }
    });

    it("returns the new tournament id", async () => {
      fetch.once(JSON.stringify({ tournamentId }));
      const id = await userAuth.createTournament(
        name,
        maxTeamSize,
        location,
        scoringType,
        tournamentType,
        entryCost,
        maxTeams,
        startDate
      );
      expect(id).toEqual(tournamentId);
    });

    // Add error test cases
  });

  describe("editTournament", () => {
    it("sends a tournament edit request", async () => {
      try {
        await userAuth.editTournament(
          tournamentId,
          name,
          maxTeamSize,
          location,
          scoringType,
          tournamentType,
          entryCost,
          maxTeams,
          startDate
        );
      } catch (error) {
        // pass
      } finally {
        const [uri, request] = fetch.mock.calls[0];
        expect(uri).toEqual(`${Config.base_url}/tournaments/edit`);
        expect(request.method).toEqual("POST");
        expect(request.headers["Authorization"]).toEqual(`Bearer ${jwt}`);
        expect(JSON.parse(request.body)).toEqual({
          tournamentId,
          ...tournament
        });
      }
    });

    it("returns the id of the edited tournament", async () => {
      fetch.once(JSON.stringify({ tournamentId }));
      const id = await userAuth.editTournament(
        tournamentId,
        name,
        maxTeamSize,
        location,
        scoringType,
        tournamentType,
        entryCost,
        maxTeams,
        startDate
      );
      expect(id).toEqual(tournamentId);
    });

    // Add error test cases
  });

  describe("deleteTournament", () => {
    it("sends a tournament deletion request", async () => {
      try {
        await userAuth.deleteTournament(tournamentId);
      } catch (error) {
        // pass
      } finally {
        const [uri, request] = fetch.mock.calls[0];
        expect(uri).toEqual(`${Config.base_url}/tournaments/delete`);
        expect(request.method).toEqual("POST");
        expect(request.headers["Authorization"]).toEqual(`Bearer ${jwt}`);
        expect(JSON.parse(request.body)).toEqual({ tournamentId });
      }
    });

    it("returns the status of the tournament's deletion", async () => {
      const deleteStatus = false;
      fetch.once(JSON.stringify({ deleteStatus }));
      const status = await userAuth.deleteTournament(tournamentId);
      expect(status).toEqual(deleteStatus);
    });

    // Add error test cases
  });

  describe("tournaments", () => {
    it("sends a tournament list request", async () => {
      try {
        await userAuth.tournaments();
      } catch (error) {
        // pass
      } finally {
        const [uri, request] = fetch.mock.calls[0];
        expect(uri).toEqual(`${Config.base_url}/tournaments`);
        expect(request.method).toEqual("GET");
        expect(request.headers["Authorization"]).toEqual(`Bearer ${jwt}`);
      }
    });

    it("returns the list of tournaments", async () => {
      const ids = [1, 42, 3, 10, 9];
      fetch.once(JSON.stringify({ tournamentId: ids }));
      const listOfTournaments = await userAuth.tournaments();
      expect(listOfTournaments).toEqual(ids);
    });

    // Add error test cases
  });

  describe("searchTournaments", () => {
    const search = "tournaments today";
    const filter = { past: "24h" };

    it("sends a tournament search request", async () => {
      try {
        await userAuth.searchTournaments(search, filter);
      } catch (error) {
        // pass
      } finally {
        const [uri, request] = fetch.mock.calls[0];
        expect(uri).toEqual(`${Config.base_url}/tournaments/search`);
        expect(request.method).toEqual("POST");
        expect(request.headers["Authorization"]).toEqual(`Bearer ${jwt}`);
        expect(JSON.parse(request.body)).toEqual({ search, filter });
      }
    });

    it("returns the matching tournaments", async () => {
      const ids = [1, 32, 3, 10, 9];
      fetch.once(JSON.stringify({ tournamentId: ids }));
      const matches = await userAuth.searchTournaments(search, filter);
      expect(matches).toEqual(ids);
    });

    // Add error test cases
  });

  describe("matches", () => {
    const matchId = 11;
    const tournamentId = 1;
    const location = "Georgia Tech";
    const details = "a very detailed description";
    const time = "2018-09-14T00:35:29.881Z";
    const partyA = "Max";
    const partyB = "Alex";
    const publish = true;
    const match = { tournamentId, location, details, time, partyA, partyB };

    describe("createMatch", () => {
      it("sends a match creation request", async () => {
        try {
          await userAuth.createMatch(
            tournamentId,
            location,
            details,
            time,
            partyA,
            partyB
          );
        } catch (error) {
          // pass
        } finally {
          const [uri, request] = fetch.mock.calls[0];
          expect(uri).toEqual(
            `${Config.base_url}/tournaments/${tournamentId}/matches/create`
          );
          expect(request.method).toEqual("POST");
          expect(request.headers["Authorization"]).toEqual(`Bearer ${jwt}`);
          expect(JSON.parse(request.body)).toEqual(match);
        }
      });

      it("returns the newly created match", async () => {
        fetch.once(JSON.stringify({ tournamentId, matchId }));
        const match = await userAuth.createMatch(
          tournamentId,
          location,
          details,
          time,
          partyA,
          partyB
        );
        expect(match).toEqual({ tournamentId, matchId });
      });
    });

    describe("editMatch", () => {
      it("sends a match edit request", async () => {
        try {
          await userAuth.editMatch(
            tournamentId,
            matchId,
            location,
            details,
            time,
            partyA,
            partyB
          );
        } catch (error) {
          // pass
        } finally {
          const [uri, request] = fetch.mock.calls[0];
          expect(uri).toEqual(
            `${Config.base_url}/tournaments/${tournamentId}/matches/edit`
          );
          expect(request.method).toEqual("POST");
          expect(request.headers["Authorization"]).toEqual(`Bearer ${jwt}`);
          expect(JSON.parse(request.body)).toEqual({ matchId, ...match });
        }
      });

      it("returns the editted match", async () => {
        fetch.once(JSON.stringify({ tournamentId, matchId }));
        const match = await userAuth.createMatch(
          tournamentId,
          matchId,
          location,
          details,
          time,
          partyA,
          partyB
        );
        expect(match).toEqual({ tournamentId, matchId });
      });
    });

    describe("deleteMatch", () => {
      it("sends a match deletion request", async () => {
        try {
          await userAuth.deleteMatch(tournamentId, matchId);
        } catch (error) {
          // pass
        } finally {
          const [uri, request] = fetch.mock.calls[0];
          expect(uri).toEqual(
            `${Config.base_url}/tournaments/${tournamentId}/matches/delete`
          );
          expect(request.method).toEqual("POST");
          expect(request.headers["Authorization"]).toEqual(`Bearer ${jwt}`);
          expect(JSON.parse(request.body)).toEqual({ tournamentId, matchId });
        }
      });

      it("returns the status of the match's deletion", async () => {
        const deleteStatus = true;
        fetch.once(JSON.stringify({ deleteStatus }));
        const status = await userAuth.deleteMatch(tournamentId, matchId);
        expect(status).toEqual(deleteStatus);
      });
    });

    describe("publishMatch", () => {
      it("sends a match publication request", async () => {
        try {
          await userAuth.publishMatch(tournamentId, matchId, publish);
        } catch (error) {
          // pass
        } finally {
          const [uri, request] = fetch.mock.calls[0];
          expect(uri).toEqual(`/tournaments/${tournamentId}/matches/publish`);
          expect(request.method).toEqual("POST");
          expect(request.headers["Authorization"]).toEqual(`Bearer ${jwt}`);
          expect(JSON.parse(request.body)).toEqual({
            tournamentId,
            matchId,
            publish
          });
        }
      });

      it("returns the status of the match's publication", async () => {
        const publishStatus = true;
        fetch.once(JSON.stringify({ publishStatus }));
        const status = await userAuth.publishMatch(
          tournamentId,
          matchId,
          publish
        );
        expect(status).toEqual(publishStatus);
      });
    });
  });
});
