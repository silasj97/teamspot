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
import RefereeAPI from "components/API/RefereeAPI";
import Authentication from "components/API/Authentication";

class TournamentRefereeAdd extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitted: false,
      formError: "",
      tournamentID: this.props.match.params.tournamentID,
      refereeEmail: ""
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
    try {
      await RefereeAPI.addReferee(
        this.state.tournamentID,
        this.state.refereeEmail
      );
      this.props.history.push(
        `/tournament/${this.state.tournamentID}/referees`
      );
    } catch (error) {
      this.setState({ formError: "Could not add user" });
    }
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
            <h2>Add Referee</h2>
            <div>
              <FormControl>
                <InputLabel>Email Address</InputLabel>
                <Input
                  value={this.state.refereeEmail}
                  required={true}
                  onChange={e =>
                    this.setState({ refereeEmail: e.target.value })
                  }
                  id="refereeEmail"
                  fullWidth={true}
                  type="email"
                />
                <FormHelperText error>{this.state.formError}</FormHelperText>
              </FormControl>
            </div>
            <div>
              <Button color="primary" size="large" value="submit" type="submit">
                Add
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(TournamentRefereeAdd);
