import React from "react";
import { withRouter } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";

import TeamCard from "components/Team/TeamCard.jsx";
import TeamAPI from "components/API/TeamAPI.js";

class TeamList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tournamentID: this.props.match.params.tournamentID,
      teamList: null
    };
  }

  async createTeamList() {
    let teams = undefined;
    try {
      teams = await TeamAPI.getTeams(this.state.tournamentID);
    } catch (error) {
      let message = <h2>Error loading teams</h2>;
      this.setState({ teamList: message });
      return;
    }
    if (teams === undefined) {
      let message = <h2>Error loading teams</h2>;
      this.setState({ teamList: message });
      return;
    }
    if (teams.length < 1) {
      let message = <h2>No teams</h2>;
      this.setState({ teamList: message });
      return;
    }
    let list = [];
    for (let team of teams) {
      let card = (
        <Grid item xs={4} key={team.id}>
          <TeamCard key={team.id} id={team.id} teamName={team.teamName} />
        </Grid>
      );
      list.push(card);
    }
    this.setState({ teamList: list });
  }

  async componentDidMount() {
    await this.createTeamList();
  }

  render() {
    return (
      <div>
        {this.state.teamList === null ? (
          <div>
            <CircularProgress />
          </div>
        ) : (
          <Grid container>{this.state.teamList}</Grid>
        )}
      </div>
    );
  }
}

export default withRouter(TeamList);
