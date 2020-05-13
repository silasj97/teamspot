import React from "react";
import { withRouter } from "react-router-dom";

import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Search from "@material-ui/icons/Search";

import TournamentCard from "components/Tournament/TournamentCard.jsx";
import TournamentAPI from "components/API/TournamentAPI.js";

class TournamentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tournamentListAll: null,
      tournamentListView: null
    };
    this.handleAddClick = this.handleAddClick.bind(this);
  }

  handleAddClick() {
    this.props.history.push("/tournament/create");
  }

  handleSearchChange(e) {
    if (this.state.tournamentListAll === null) return;
    const searchTerm = e.target.value;
    this.setState({
      tournamentListView: this.state.tournamentListAll.filter(function(
        tournamentCard
      ) {
        return tournamentCard.props.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      })
    });
  }

  async createTournamentList() {
    let tournaments = undefined;
    try {
      tournaments = await TournamentAPI.getTournaments();
      console.log(tournaments);
    } catch (error) {
      let message = <h2>Error loading tournaments</h2>;
      this.setState({ tournamentListView: message });
      return;
    }
    if (tournaments === undefined) {
      let message = <h2>Error loading tournaments</h2>;
      this.setState({ tournamentListView: message });
      return;
    }
    if (tournaments.length < 1) {
      let message = <h2>No upcoming tournaments</h2>;
      this.setState({ tournamentListView: message });
      return;
    }
    let list = [];
    for (let tournament of tournaments) {
      let card = (
        <TournamentCard
          key={tournament.id}
          id={tournament.id}
          name={tournament.tournamentName}
          sponsor={tournament.creator}
          date={new Date(Date.parse(tournament.startDate)).toDateString()}
        />
      );
      list.push(card);
    }
    this.setState({
      tournamentListAll: list,
      tournamentListView: list
    });
  }

  async componentDidMount() {
    await this.createTournamentList();
  }

  render() {
    return (
      <div>
        <TextField
          style={{ width: "95%", marginBottom: "20px" }}
          placeholder="Search"
          onChange={this.handleSearchChange.bind(this)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search />
              </InputAdornment>
            )
          }}
        />
        {this.state.tournamentListView === null ? (
          <div>
            <CircularProgress />
          </div>
        ) : (
          <div>{this.state.tournamentListView}</div>
        )}
        <Button
          variant="fab"
          color="primary"
          aria-label="Add"
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px"
          }}
          onClick={this.handleAddClick}
        >
          <AddIcon style={{ color: "#ffffff" }} />
        </Button>
      </div>
    );
  }
}

export default withRouter(TournamentList);
