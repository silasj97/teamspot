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
import PaymentSnackbar from "components/Team/PaymentSnackbar.jsx";
import TeamAPI from "components/API/TeamAPI.js";

const teamDetailsStyle = {
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

class TeamDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teamID: this.props.match.params.teamID,
      teamName: null,
      leader: null,
      tournamentID: null,
      paid: null,
      seed: null,
      entryCost: null,
      membersList: null,
      currentUser: Authentication.getUID()
    };
    this.handleClickDelete = this.handleClickDelete.bind(this);
    this.handleClickAddMember = this.handleClickAddMember.bind(this);
  }

  async handleClickDelete() {
    let confirm = window.confirm("Are you sure you want to delete this team?");
    if (confirm) {
      try {
        await TeamAPI.withdrawTeam(this.state.tournamentID, this.state.teamID);
      } catch (error) {
        // show message
        return;
      }
      this.props.history.push("/");
    }
  }

  async handleClickDeleteMember(email) {
    let confirm = window.confirm(
      "Are you sure you want to remove this team member?"
    );
    if (confirm) {
      await TeamAPI.removeFromTeam(this.state.teamID, email);
      window.location.reload();
    }
  }

  handleClickAddMember() {
    this.props.history.push(`/team/${this.state.teamID}/invite`);
  }

  async getTeamDetails(id) {
    let details = undefined;
    try {
      details = await TeamAPI.getTeam(id);
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
    this.setState(details);
  }

  async getTeamMembers(id) {
    let members = undefined;
    try {
      members = await TeamAPI.getTeamMembers(id);
    } catch (error) {
      return;
    }
    if (members === undefined || members.length < 1) {
      return;
    }
    let list = [];
    for (let member of members) {
      list.push(<Divider />);
      let listItem = (
        <ListItem>
          <ListItemText primary={member.userEmail} />
          {this.state.currentUser != null &&
          (this.state.currentUser === this.state.leader ||
            this.state.currentUser === member.userEmail) &&
          member.userEmail !== this.state.leader ? (
            <ListItemSecondaryAction>
              <IconButton
                aria-label="Delete"
                onClick={this.handleClickDeleteMember.bind(
                  this,
                  member.userEmail
                )}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          ) : null}
        </ListItem>
      );
      list.push(listItem);
    }
    this.setState({ membersList: list });
  }

  async componentDidMount() {
    await this.getTeamDetails(this.state.teamID);
    await this.getTeamMembers(this.state.teamID);
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
            this.state.currentUser === this.state.leader ? (
              <div className={classes.detailsIcons}>
                <IconButton
                  className={classes.button}
                  aria-label="Delete"
                  onClick={this.handleClickDelete}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            ) : null}
            {this.state.paid != null &&
            this.state.paid === 0 &&
            (this.state.currentUser != null &&
              this.state.currentUser === this.state.leader) &&
            this.state.entryCost != null ? (
              <PaymentSnackbar
                paymentAmount={this.state.entryCost}
                teamId={this.state.teamID}
              />
            ) : null}
            <h1>{this.state.teamName}</h1>
            <br />
            <h2 style={{ margin: "0px", display: "inline-flex" }}>Members</h2>
            {this.state.currentUser != null &&
            this.state.currentUser === this.state.leader ? (
              <div style={{ display: "inline-flex" }}>
                <IconButton
                  className={classes.button}
                  aria-label="Add Member"
                  onClick={this.handleClickAddMember}
                >
                  <AddIcon />
                </IconButton>
              </div>
            ) : null}
            {this.state.membersList === null ? (
              <div>{null}</div>
            ) : (
              <div className={classes.listStyle}>
                <List>{this.state.membersList}</List>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(teamDetailsStyle)(TeamDetails);
