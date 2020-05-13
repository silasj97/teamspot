import React from "react";
import { withRouter } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";

import MatchCard from "components/Match/MatchCard.jsx";
import MatchAPI from "components/API/MatchAPI.js";

class MatchList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tournamentID: this.props.match.params.tournamentID,
      matchList: null
    };
  }

  async createMatchList() {
    let matches = undefined;
    try {
      matches = await MatchAPI.getMatches(this.state.tournamentID);
    } catch (error) {
      let message = <h2>Error loading matches</h2>;
      this.setState({ matchList: message });
      return;
    }
    if (matches === undefined) {
      let message = <h2>Error loading matches</h2>;
      this.setState({ matchList: message });
      return;
    }
    if (matches.length < 1) {
      let message = <h2>No matches</h2>;
      this.setState({ matchList: message });
      return;
    }
    let list = [];
    for (let match of matches) {
      list.push(
        <Grid item xs={4} key={match.id}>
          <MatchCard tournamentMatch={match} key={match.id} />
        </Grid>
      );
    }
    this.setState({ matchList: list });
  }

  async componentDidMount() {
    await this.createMatchList();
  }

  render() {
    return (
      <div>
        {this.state.matchList === null ? (
          <div>
            <CircularProgress />
          </div>
        ) : (
          <Grid container>{this.state.matchList}</Grid>
        )}
      </div>
    );
  }
}

export default withRouter(MatchList);
