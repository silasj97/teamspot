import React from "react";
import { withRouter } from "react-router-dom";

import FormHelperText from "@material-ui/core/FormHelperText";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import Header from "components/Header/Header.jsx";
import NoAuthHeaderLinks from "components/Header/NoAuthHeaderLinks.jsx";
import AuthHeaderLinks from "components/Header/AuthHeaderLinks.jsx";
import MatchAPI from "components/API/MatchAPI";
import Authentication from "components/API/Authentication";

function isIntOrEmpty(possibleIntString) {
  return !possibleIntString || Number.isSafeInteger(Number(possibleIntString));
}

class MatchEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitted: false,
      formError: "",
      tournamentId: this.props.match.params.tournamentID,
      matchId: this.props.match.params.matchID,
      location: "",
      matchName: "",
      matchTime: "",
      teamA: {},
      teamB: {},
      feederA: "",
      feederB: "",
      publish: false,
      initialPublish: false
    };
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  async getMatchDetails(id) {
    let details = undefined;
    try {
      details = await MatchAPI.getMatch(id);
    } catch (error) {
      this.props.history.push("/NotFound");
      return;
    }
    if (details === undefined) {
      this.props.history.push("/NotFound");
      return;
    }
    if (details.length < 1) {
      this.props.history.push("/NotFound");
      return;
    }
    details = details[0];
    let date = details.matchTime
      ? new Date(details.matchTime.slice(0, 19).replace("T", " ") + " UTC")
      : new Date();
    details.matchTime = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(0, 19);
    details.publish = details.publish === 1 ? true : false;
    details.teamA = details.teamA || {};
    details.teamB = details.teamB || {};
    this.setState(details);
    this.setState({ initialPublish: details.publish });
  }

  async componentDidMount() {
    if (!Authentication.loggedIn()) {
      this.props.history.push("/login");
    }
    await this.getMatchDetails(this.state.matchId);
  }

  async handleFormSubmit(event) {
    this.setState({ submitted: true });
    event.preventDefault();
    const teamA = this.state.teamA.teamId;
    const teamB = this.state.teamB.teamId;
    const feederA = this.state.feederA;
    const feederB = this.state.feederB;
    if (![teamA, teamB, feederA, feederB].every(isIntOrEmpty)) {
      return;
    }
    await MatchAPI.editMatch(
      this.state.matchId,
      this.state.location,
      this.state.matchName,
      new Date(this.state.matchTime)
        .toISOString()
        .slice(0, 19)
        .replace("T", " "),
      teamA ? Number(teamA) : null,
      teamB ? Number(teamB) : null,
      feederA ? Number(feederA) : null,
      feederB ? Number(feederB) : null
    );
    if (this.state.publish !== this.state.initialPublish) {
      await MatchAPI.publishMatch(this.state.matchId, this.state.publish);
    }
    this.props.history.push(`/tournament/${this.state.tournamentId}`);
  }

  render() {
    const { classes, ...rest } = this.props;
    return (
      <div>
        <div>
          <Header
            color="primary"
            brand="TournamentBuzz"
            rightLinks={
              Authentication.loggedIn() ? (
                <AuthHeaderLinks />
              ) : (
                <NoAuthHeaderLinks />
              )
            }
            {...rest}
          />
        </div>
        <div>
          <form onSubmit={this.handleFormSubmit}>
            <h2>Edit Match</h2>
            <FormHelperText error>{this.state.formError}</FormHelperText>

            <div>
              <FormControl>
                <InputLabel>Match Name</InputLabel>
                <Input
                  value={this.state.matchName}
                  required={true}
                  onChange={e => this.setState({ matchName: e.target.value })}
                  id="matchName"
                  fullWidth={true}
                />
                <FormHelperText>
                  {this.state.submitted && !this.state.matchName
                    ? "Match Name is required"
                    : ""}
                </FormHelperText>
              </FormControl>
            </div>
            <div>
              <FormControl>
                <InputLabel>Location</InputLabel>
                <Input
                  value={this.state.location}
                  onChange={e => this.setState({ location: e.target.value })}
                  id="location"
                  fullWidth={true}
                />
                <FormHelperText>
                  {this.state.submitted && !this.state.location
                    ? "Location is required"
                    : ""}
                </FormHelperText>
              </FormControl>
            </div>
            <div>
              <FormControl>
                <InputLabel shrink={true}>Match Date & Time</InputLabel>
                <Input
                  type="datetime-local"
                  onChange={e => this.setState({ matchTime: e.target.value })}
                  id="matchTime"
                  fullWidth={true}
                  required={true}
                  value={this.state.matchTime}
                />
                <FormHelperText>
                  {this.state.submitted && !this.state.matchTime
                    ? "Match Time is required"
                    : ""}
                </FormHelperText>
              </FormControl>
            </div>
            <div>
              <FormControl>
                <InputLabel>Team A</InputLabel>
                <Input
                  value={this.state.teamA.teamId}
                  onChange={e =>
                    this.setState({ teamA: { teamId: e.target.value } })
                  }
                  id="teamA"
                  fullWidth={true}
                />
                <FormHelperText>
                  {this.state.submitted &&
                  !isIntOrEmpty(this.state.teamA.teamId)
                    ? "Team ID must be a number"
                    : ""}
                </FormHelperText>
              </FormControl>
              <FormControl>
                <InputLabel>Team B</InputLabel>
                <Input
                  value={this.state.teamB.teamId}
                  onChange={e =>
                    this.setState({ teamB: { teamId: e.target.value } })
                  }
                  id="teamB"
                  fullWidth={true}
                />
                <FormHelperText>
                  {this.state.submitted &&
                  !isIntOrEmpty(this.state.teamB.teamId)
                    ? "Team ID must be a number"
                    : ""}
                </FormHelperText>
              </FormControl>
            </div>
            <div>
              <FormControl>
                <InputLabel>Feeder Match A</InputLabel>
                <Input
                  value={this.state.feederA}
                  onChange={e => this.setState({ feederA: e.target.value })}
                  id="feederA"
                  fullWidth={true}
                />
                <FormHelperText>
                  {this.state.submitted && !isIntOrEmpty(this.state.feederA)
                    ? "Feeder match ID must be a number"
                    : ""}
                </FormHelperText>
              </FormControl>
              <FormControl>
                <InputLabel>Feeder Match B</InputLabel>
                <Input
                  value={this.state.feederB}
                  onChange={e => this.setState({ feederB: e.target.value })}
                  id="feederB"
                  fullWidth={true}
                />
                <FormHelperText>
                  {this.state.submitted && !isIntOrEmpty(this.state.feederB)
                    ? "Feeder match ID must be a number"
                    : ""}
                </FormHelperText>
              </FormControl>
            </div>
            <div>
              <FormControl>
                <InputLabel>Status</InputLabel>
                <Select
                  value={this.state.publish}
                  inputProps={{ id: "publish" }}
                  onChange={e => this.setState({ publish: e.target.value })}
                >
                  <MenuItem value={false}>Unpublished</MenuItem>
                  <MenuItem value={true}>Published</MenuItem>
                </Select>
              </FormControl>
            </div>
            <br />
            <div>
              <Button color="primary" size="large" value="submit" type="submit">
                Save
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(MatchEdit);
