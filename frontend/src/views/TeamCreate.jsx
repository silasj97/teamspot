import React from "react";
import { withRouter } from "react-router-dom";

import FormHelperText from "@material-ui/core/FormHelperText";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";

import Header from "components/Header/Header.jsx";
import NoAuthHeaderLinks from "components/Header/NoAuthHeaderLinks.jsx";
import AuthHeaderLinks from "components/Header/AuthHeaderLinks.jsx";
import TeamAPI from "components/API/TeamAPI";
import Authentication from "components/API/Authentication";

class TeamCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitted: false,
      formError: "",
      tournamentId: this.props.match.params.tournamentID,
      teamName: ""
    };
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  componentDidMount() {
    if (!Authentication.loggedIn()) {
      this.props.history.push("/login");
    }
  }

  async handleFormSubmit(event) {
    event.preventDefault();
    await TeamAPI.createTeam(this.state.tournamentId, this.state.teamName);
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
            <h2>Create Team</h2>
            <FormHelperText error>{this.state.formError}</FormHelperText>

            <div>
              <FormControl>
                <InputLabel>Team Name</InputLabel>
                <Input
                  value={this.state.teamName}
                  required={true}
                  onChange={e => this.setState({ teamName: e.target.value })}
                  id="teamName"
                  fullWidth={true}
                />
                <FormHelperText>
                  {this.state.submitted && !this.state.teamName
                    ? "Team Name is required"
                    : ""}
                </FormHelperText>
              </FormControl>
            </div>
            <div>
              <Button color="primary" size="large" value="submit" type="submit">
                Create
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(TeamCreate);
