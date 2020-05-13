import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";

// core components
import Header from "components/Header/Header.jsx";
import NoAuthHeaderLinks from "components/Header/NoAuthHeaderLinks.jsx";
import AuthHeaderLinks from "components/Header/AuthHeaderLinks.jsx";
import Authentication from "components/API/Authentication.js";
import TournamentAPI from "components/API/TournamentAPI.js";
import RefereeAPI from "components/API/RefereeAPI.js";

const tournamentRefereesStyle = {
  detailsText: {
    marginBottom: "10px"
  },
  detailsIcons: {
    float: "right",
    position: "fixed",
    right: "1%"
  },
  listStyle: {
    width: "min-content",
    margin: "auto"
  }
};

class TournamentReferees extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tournamentID: this.props.match.params.tournamentID,
      currentUser: Authentication.getUID(),
      tournamentName: null,
      creator: null,
      refereesList: null
    };
    this.handleClickAddReferee = this.handleClickAddReferee.bind(this);
  }

  handleClickAddReferee() {
    this.props.history.push(
      `/tournament/${this.state.tournamentID}/referees/add`
    );
  }

  async handleClickDeleteReferee(email) {
    let confirm = window.confirm(
      "Are you sure you want to remove this referee?"
    );
    if (confirm) {
      await RefereeAPI.removeReferee(this.state.tournamentID, email);
      window.location.reload();
    }
  }

  async getTournamentDetails(id) {
    let details = undefined;
    try {
      details = await TournamentAPI.getTournament(id);
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
    if (details.creator !== this.state.currentUser) {
      this.props.history.push(`/tournament/${this.state.tournamentID}`);
      return;
    }
    this.setState({
      tournamentName: details.tournamentName,
      creator: details.creator
    });
  }

  async getReferees(id) {
    let referees = undefined;
    try {
      referees = await RefereeAPI.getReferees(id);
    } catch (error) {
      return;
    }
    if (referees === undefined || referees.length < 1) {
      return;
    }
    let list = [];
    for (let referee of referees) {
      list.push(<Divider />);
      let listItem = (
        <ListItem>
          <ListItemText primary={referee.userEmail} />
          <ListItemSecondaryAction>
            <IconButton
              aria-label="Delete"
              onClick={this.handleClickDeleteReferee.bind(
                this,
                referee.userEmail
              )}
            >
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      );
      list.push(listItem);
    }
    this.setState({ refereesList: list });
  }

  async componentDidMount() {
    if (!Authentication.loggedIn()) {
      this.props.history.push("/login");
    }
    await this.getTournamentDetails(this.state.tournamentID);
    await this.getReferees(this.state.tournamentID);
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
          <div>
            <h1>{this.state.tournamentName}</h1>
            <br />
            <h2 style={{ margin: "0px", display: "inline-flex" }}>Referees</h2>
            {this.state.currentUser != null &&
            this.state.currentUser === this.state.creator ? (
              <div style={{ display: "inline-flex" }}>
                <IconButton
                  className={classes.button}
                  aria-label="Add Referee"
                  onClick={this.handleClickAddReferee}
                >
                  <AddIcon />
                </IconButton>
              </div>
            ) : null}
            {this.state.refereesList === null ? (
              <div>{null}</div>
            ) : (
              <div className={classes.listStyle}>
                <List>{this.state.refereesList}</List>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(tournamentRefereesStyle)(TournamentReferees);
