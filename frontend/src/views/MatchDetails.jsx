import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import PencilIcon from "@material-ui/icons/Create";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

// core components
import Header from "components/Header/Header.jsx";
import NoAuthHeaderLinks from "components/Header/NoAuthHeaderLinks.jsx";
import AuthHeaderLinks from "components/Header/AuthHeaderLinks.jsx";
import Authentication from "components/API/Authentication.js";
import MatchAPI from "components/API/MatchAPI.js";
import TournamentAPI from "components/API/TournamentAPI.js";
import RefereeAPI from "components/API/RefereeAPI.js";
import Grid from "@material-ui/core/Grid";

const matchDetailsStyle = {
  detailsText: {
    marginBottom: "10px"
  },
  detailsIcons: {
    float: "right",
    position: "fixed",
    right: "1%"
  }
};

class MatchDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: Authentication.getUID(),
      creator: null,
      tournamentID: this.props.match.params.tournamentID,
      matchID: this.props.match.params.matchID,
      location: null,
      matchTime: null,
      matchName: null,
      teamA: {},
      teamB: {},
      published: null,
      isReferee: false,
      scoreButtonText: "Enter Scores",
      enteringScores: false,
      scoreA: null,
      scoreB: null,
      winner: "0"
    };
    this.handleClickEdit = this.handleClickEdit.bind(this);
    this.handleClickDelete = this.handleClickDelete.bind(this);
    this.handleClickScores = this.handleClickScores.bind(this);
  }

  handleClickEdit() {
    this.props.history.push(
      `/tournament/${this.state.tournamentID}/match/${this.state.matchID}/edit`
    );
  }

  async handleClickDelete() {
    let confirm = window.confirm("Are you sure you want to delete this match?");
    if (confirm) {
      try {
        await MatchAPI.deleteMatch(this.state.matchID);
      } catch (error) {
        // show message
        return;
      }
      this.props.history.push("/");
    }
  }

  async handleClickScores() {
    if (this.state.enteringScores) {
      await MatchAPI.submitMatchScore(
        this.state.matchID,
        this.state.scoreA,
        this.state.scoreB,
        parseInt(this.state.winner, 10)
      );
      this.setState({ scoreButtonText: "Enter Scores", enteringScores: false });
    } else {
      this.setState({ scoreButtonText: "Save Scores", enteringScores: true });
    }
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
    details.matchTime = details.matchTime
      ? new Date(
          details.matchTime.slice(0, 19).replace("T", " ") + " UTC"
        ).toLocaleString()
      : "";
    details.winner = "" + details.winner;
    this.setState(details);
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
    this.setState({ creator: details.creator });
  }

  async componentDidMount() {
    await this.getMatchDetails(this.state.matchID);
    await this.getTournamentDetails(this.state.tournamentID);
    if (this.state.currentUser !== null) {
      const isReferee = await RefereeAPI.isReferee(
        this.state.tournamentID,
        this.state.currentUser
      );
      this.setState({ isReferee: isReferee });
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
          <div>
            {this.state.currentUser != null &&
            this.state.currentUser === this.state.creator ? (
              <div className={classes.detailsIcons}>
                <IconButton
                  className={classes.button}
                  aria-label="Delete"
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
            <h2>{this.state.matchName}</h2>
          </div>
          <Grid container>
            <Grid item xs={4}>
              <Typography variant="headline" className={classes.detailsText}>
                <b>{this.state.teamA ? this.state.teamA.teamName : "TBD"}</b>
              </Typography>
              {this.state.winner === "1" ? (
                <Typography variant="caption" style={{ color: "#32CD32" }}>
                  <h2>
                    <b>Winner</b>
                  </h2>
                </Typography>
              ) : null}
              {this.state.enteringScores ? (
                <FormControl>
                  <InputLabel>Score</InputLabel>
                  <Input
                    value={this.state.scoreA}
                    placeholder={this.state.scoreA}
                    required={true}
                    onChange={e => this.setState({ scoreA: e.target.value })}
                    id="scoreA"
                    fullWidth={true}
                    type="number"
                    min="0"
                    step="1"
                  />
                </FormControl>
              ) : null}
            </Grid>
            <Grid item xs={4}>
              <Typography variant="headline" className={classes.detailsText}>
                <b>VS</b>
              </Typography>
              <Typography variant="body1" className={classes.detailsText}>
                <b>Time:</b> {this.state.matchTime || "TBD"}
              </Typography>
              <Typography variant="body1" className={classes.detailsText}>
                <b>Location:</b> {this.state.location || "TBD"}
              </Typography>
              {this.state.enteringScores ? (
                <FormControl>
                  <InputLabel>Winner</InputLabel>
                  <Select
                    value={this.state.winner}
                    inputProps={{ id: "winner" }}
                    onChange={e => this.setState({ winner: e.target.value })}
                  >
                    <MenuItem value="0">No winner</MenuItem>
                    <MenuItem value="1">
                      {this.state.teamA ? this.state.teamA.teamName : "TBD"}
                    </MenuItem>
                    <MenuItem value="2">
                      {this.state.teamB ? this.state.teamB.teamName : "TBD"}
                    </MenuItem>
                  </Select>
                </FormControl>
              ) : null}
              <br />
              <br />
              {this.state.isReferee ? (
                <Button
                  style={{ color: "white" }}
                  variant="contained"
                  color="primary"
                  onClick={this.handleClickScores}
                >
                  {this.state.scoreButtonText}
                </Button>
              ) : null}
            </Grid>
            <Grid item xs={4}>
              <Typography variant="headline" className={classes.detailsText}>
                <b>{this.state.teamB ? this.state.teamB.teamName : "TBD"}</b>
              </Typography>
              {this.state.winner === "2" ? (
                <Typography variant="caption" style={{ color: "#32CD32" }}>
                  <h2>
                    <b>Winner</b>
                  </h2>
                </Typography>
              ) : null}
              {this.state.enteringScores ? (
                <FormControl>
                  <InputLabel>Score</InputLabel>
                  <Input
                    value={this.state.scoreB}
                    placeholder={this.state.scoreB}
                    required={true}
                    onChange={e => this.setState({ scoreB: e.target.value })}
                    id="scoreB"
                    fullWidth={true}
                    type="number"
                    min="0"
                    step="1"
                  />
                </FormControl>
              ) : null}
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

export default withStyles(matchDetailsStyle)(MatchDetails);
