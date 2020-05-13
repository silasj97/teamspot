import React from "react";
import { withRouter } from "react-router-dom";

import FormHelperText from "@material-ui/core/FormHelperText";
import Input from "@material-ui/core/Input";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";

import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import CardFooter from "components/Card/CardFooter";
import Button from "components/CustomButtons/Button";

import TournamentAPI from "components/API/TournamentAPI";
import Authentication from "components/API/Authentication";

class TournamentCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitted: false,
      formError: "",
      name: "",
      description: "",
      maxTeamSize: "",
      location: "",
      scoringType: "Points",
      tournamentType: "Single Elim",
      entryCost: "",
      maxTeams: "",
      startDate: "2019-01-01",
      endDate: "2019-01-01"
    };
    this.canSubmit = this.canSubmit.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  componentDidMount() {
    if (!Authentication.loggedIn()) {
      this.props.history.push("/login");
    }
  }

  canSubmit() {
    return true;
  }

  async handleFormSubmit(event) {
    event.preventDefault();
    await TournamentAPI.createTournament(
      this.state.name,
      this.state.description,
      this.state.maxTeamSize,
      this.state.location,
      this.state.scoringType,
      this.state.tournamentType,
      Number(this.state.entryCost),
      Number(this.state.maxTeams),
      new Date(this.state.startDate).toISOString().split("T")[0],
      new Date(this.state.endDate).toISOString().split("T")[0]
    );
    this.props.history.push("/");
  }

  render() {
    return (
      <Card>
        <form onSubmit={this.handleFormSubmit}>
          <CardHeader color="primary">
            <h2>Create Tournament</h2>
          </CardHeader>
          <CardBody>
            <FormHelperText error>{this.state.formError}</FormHelperText>

            <div>
              <FormControl>
                <InputLabel>Tournament Name</InputLabel>
                <Input
                  value={this.state.name}
                  onChange={e => this.setState({ name: e.target.value })}
                  id="name"
                  fullWidth={true}
                />
                <FormHelperText>
                  {this.state.submitted && !this.state.name
                    ? "Tournament Name is required"
                    : ""}
                </FormHelperText>
              </FormControl>
            </div>

            <div>
              <FormControl>
                <InputLabel>Description</InputLabel>
                <Input
                  value={this.state.description}
                  onChange={e => this.setState({ description: e.target.value })}
                  id="description"
                  fullWidth={true}
                />
                <FormHelperText>
                  {this.state.submitted && !this.state.description
                    ? "Description is required"
                    : ""}
                </FormHelperText>
              </FormControl>
            </div>

            <div>
              <FormControl>
                <InputLabel>Max Team Size</InputLabel>
                <Input
                  value={this.state.maxTeamSize}
                  onChange={e => this.setState({ maxTeamSize: e.target.value })}
                  id="maxTeamSize"
                  fullWidth={true}
                />
                <FormHelperText>
                  {this.state.submitted && !this.state.maxTeamSize
                    ? "Max Team Size is required"
                    : ""}
                  {!Number.isInteger(Number(this.state.maxTeamSize))
                    ? "Max Team Size must be a number"
                    : ""}
                </FormHelperText>
              </FormControl>
            </div>
            <div>
              <FormControl>
                <InputLabel>Tournament Type</InputLabel>
                <Select
                  value={this.state.tournamentType}
                  inputProps={{ id: "tournamentType" }}
                  onChange={e =>
                    this.setState({ tournamentType: e.target.value })
                  }
                >
                  <MenuItem value="Single Elim">Single Elimination</MenuItem>
                  <MenuItem value="Double Elim">Double Elimination</MenuItem>
                  <MenuItem value="Round-robin">Round Robin</MenuItem>
                </Select>
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
                <InputLabel>Entry Cost</InputLabel>
                <Input
                  value={this.state.entryCost}
                  onChange={e => this.setState({ entryCost: e.target.value })}
                  id="entryCost"
                  fullWidth={true}
                />
                <FormHelperText>
                  {this.state.submitted && !this.state.entryCost
                    ? "Entry Cost is required"
                    : ""}
                  {!Number.isInteger(Number(this.state.entryCost))
                    ? "Entry Cost must be a whole dollar amount"
                    : ""}
                </FormHelperText>
              </FormControl>
            </div>

            <div>
              <FormControl>
                <InputLabel>Max Teams</InputLabel>
                <Input
                  value={this.state.maxTeams}
                  onChange={e => this.setState({ maxTeams: e.target.value })}
                  id="maxTeams"
                  fullWidth={true}
                />
                <FormHelperText>
                  {this.state.submitted && !this.state.maxTeams
                    ? "Max Teams is required"
                    : ""}
                  {!Number.isInteger(Number(this.state.maxTeams))
                    ? "Max Teams must be a number"
                    : ""}
                </FormHelperText>
              </FormControl>
            </div>

            <div>
              <FormControl>
                <InputLabel shrink={true}>Start Date</InputLabel>
                <Input
                  type="date"
                  onChange={e => this.setState({ startDate: e.target.value })}
                  id="startDate"
                  fullWidth={true}
                  required={true}
                  placeholder=""
                />
                <FormHelperText>
                  {this.state.submitted && !this.state.startDate
                    ? "Start Date is required"
                    : ""}
                </FormHelperText>
              </FormControl>
              <FormControl>
                <InputLabel shrink={true}>End Date</InputLabel>
                <Input
                  type="date"
                  onChange={e => this.setState({ endDate: e.target.value })}
                  id="endDate"
                  fullWidth={true}
                  required={true}
                  placeholder=""
                />
                <FormHelperText>
                  {this.state.submitted && !this.state.endDate
                    ? "End Date is required"
                    : ""}
                </FormHelperText>
              </FormControl>
            </div>
          </CardBody>
          <CardFooter style={{ display: "block" }}>
            <Button
              simple
              color="primary"
              size="lg"
              value="submit"
              type="submit"
            >
              Create
            </Button>
          </CardFooter>
        </form>
      </Card>
    );
  }
}

export default withRouter(TournamentCreate);
