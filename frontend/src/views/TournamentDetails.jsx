import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import PencilIcon from "@material-ui/icons/Create";
import AddIcon from "@material-ui/icons/Add";
import PersonAdd from "@material-ui/icons/PersonAdd";

// core components
import Header from "components/Header/Header.jsx";
import NoAuthHeaderLinks from "components/Header/NoAuthHeaderLinks.jsx";
import AuthHeaderLinks from "components/Header/AuthHeaderLinks.jsx";
import Authentication from "components/API/Authentication.js";
import TournamentAPI from "components/API/TournamentAPI.js";
import MatchList from "components/Match/MatchList.jsx";
import TeamList from "components/Team/TeamList.jsx";

import tournamentDetailsStyle from "assets/jss/views/tournamentDetailsStyle.jsx";

class TournamentDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tournamentName: null,
      tournamentID: this.props.match.params.tournamentID,
      creator: null,
      description: null,
      maxTeamSize: null,
      location: null,
      scoringType: null,
      tournamentType: null,
      entryCost: null,
      maxTeams: null,
      startDate: null,
      endDate: null,
      currentUser: Authentication.getUID()
    };
    this.handleClickEdit = this.handleClickEdit.bind(this);
    this.handleClickDelete = this.handleClickDelete.bind(this);
    this.handleClickAddReferee = this.handleClickAddReferee.bind(this);
    this.handleClickAddMatch = this.handleClickAddMatch.bind(this);
    this.handleClickAddTeam = this.handleClickAddTeam.bind(this);
    this.generateBracket = this.generateBracket.bind(this);
  }

  handleClickAddReferee() {
    this.props.history.push(`/tournament/${this.state.tournamentID}/referees`);
  }

  handleClickEdit() {
    this.props.history.push(`/tournament/${this.state.tournamentID}/edit`);
  }

  async handleClickDelete() {
    let confirm = window.confirm(
      "Are you sure you want to delete this tournament?"
    );
    if (confirm) {
      try {
        await TournamentAPI.deleteTournament(this.state.tournamentID);
      } catch (error) {
        // show message
        return;
      }
      this.props.history.push("/");
    }
  }

  handleClickAddMatch() {
    this.props.history.push(
      `/tournament/${this.state.tournamentID}/match/create`
    );
  }

  handleClickAddTeam() {
    this.props.history.push(
      `/tournament/${this.state.tournamentID}/team/create`
    );
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
    details.startDate = new Date(details.startDate).toDateString();
    details.endDate = new Date(details.endDate).toDateString();
    this.setState(details);
  }

  async componentDidMount() {
    await this.getTournamentDetails(this.props.match.params.tournamentID);
  }

  async generateBracket() {
    await TournamentAPI.generateBracket(this.state.tournamentID);
    window.location.reload();
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
        <div className={classes.detailsDiv}>
          {this.state.currentUser != null &&
          this.state.currentUser === this.state.creator ? (
            <div className={classes.detailsIcons}>
              <IconButton
                className={classes.button}
                aria-label="Add Referee"
                onClick={this.handleClickAddReferee}
              >
                <PersonAdd />
              </IconButton>
              <IconButton
                className={classes.button}
                aria-label="Edit"
                onClick={this.handleClickEdit}
              >
                <PencilIcon />
              </IconButton>
              <IconButton
                className={classes.button}
                aria-label="Delete"
                onClick={this.handleClickDelete}
              >
                <DeleteIcon />
              </IconButton>
            </div>
          ) : null}
          <Typography variant="headline" className={classes.detailsText}>
            <b>{this.state.tournamentName}</b>
          </Typography>
          <Typography variant="body1" className={classes.detailsText}>
            <b>Tournament ID:</b> {this.props.match.params.tournamentID}
          </Typography>
          <Typography variant="body1" className={classes.detailsText}>
            <b>Creator:</b> {this.state.creator}
          </Typography>
          <Typography variant="body1" className={classes.detailsText}>
            <b>Description:</b> {this.state.description}
          </Typography>
          <Typography variant="body1" className={classes.detailsText}>
            <b>Location:</b> {this.state.location}
          </Typography>
          <Typography variant="body1" className={classes.detailsText}>
            <b>Scoring Type:</b> {this.state.scoringType}
          </Typography>
          <Typography variant="body1" className={classes.detailsText}>
            <b>Tournament Type:</b> {this.state.tournamentType}
          </Typography>
          <Typography variant="body1" className={classes.detailsText}>
            <b>Max Team Size:</b> {this.state.maxTeamSize}
          </Typography>
          <Typography variant="body1" className={classes.detailsText}>
            <b>Entry Cost:</b> {this.state.entryCost}
          </Typography>
          <Typography variant="body1" className={classes.detailsText}>
            <b>Max Teams:</b> {this.state.maxTeams}
          </Typography>
          <Typography variant="body1" className={classes.detailsText}>
            <b>Start Date:</b> {this.state.startDate}
          </Typography>
          <Typography variant="body1" className={classes.detailsText}>
            <b>End Date:</b> {this.state.endDate}
          </Typography>
          {this.state.currentUser != null &&
          this.state.currentUser === this.state.creator ? (
            <Button
              color="primary"
              variant="contained"
              onClick={this.generateBracket}
            >
              Generate Bracket
            </Button>
          ) : null}
        </div>
        <hr />
        <div>
          {this.state.currentUser != null &&
          this.state.currentUser === this.state.creator ? (
            <div className={classes.detailsIcons}>
              <IconButton
                className={classes.button}
                aria-label="Add Match"
                onClick={this.handleClickAddMatch}
              >
                <AddIcon />
              </IconButton>
            </div>
          ) : null}
          <Typography variant="headline" className={classes.detailsText}>
            <a href={`/tournament/${this.state.tournamentID}/bracket`}>
              <b>Matches</b>
            </a>
          </Typography>
          <MatchList tournamentID={this.props.match.params.tournamentID} />
        </div>
        <hr />
        <div>
          {this.state.currentUser != null ? (
            <div className={classes.detailsIcons}>
              <IconButton
                className={classes.button}
                aria-label="Add Team"
                onClick={this.handleClickAddTeam}
              >
                <AddIcon />
              </IconButton>
            </div>
          ) : null}
          <Typography variant="headline" className={classes.detailsText}>
            <b>Teams</b>
          </Typography>
          <TeamList tournamentID={this.props.match.params.tournamentID} />
        </div>
      </div>
    );
  }
}

export default withStyles(tournamentDetailsStyle)(TournamentDetails);
