import React from "react";
import { withRouter } from "react-router-dom";

import CircularProgress from "@material-ui/core/CircularProgress";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import CheckIcon from "@material-ui/icons/Check";

import Header from "components/Header/Header.jsx";
import NoAuthHeaderLinks from "components/Header/NoAuthHeaderLinks.jsx";
import AuthHeaderLinks from "components/Header/AuthHeaderLinks.jsx";
import TeamAPI from "components/API/TeamAPI";
import Authentication from "components/API/Authentication";

class Notifications extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notificationList: null,
      pendingTeams: null
    };
  }

  async handleClickAcceptInvite(id) {
    await TeamAPI.acceptInvite(id);
    window.location.reload();
  }

  async handleClickDeclineInvite(id) {
    await TeamAPI.declineInvite(id);
    window.location.reload();
  }

  async getPendingInvites() {
    let pendingInvites;
    try {
      pendingInvites = await TeamAPI.getPendingInvites();
    } catch (error) {
      let message = <h2>No Notifications</h2>;
      this.setState({ notificationList: message });
      return;
    }
    if (pendingInvites === undefined || pendingInvites.length < 1) {
      let message = <h2>No Notifications</h2>;
      this.setState({ notificationList: message });
      return;
    }
    let teamList = [];
    for (let invite of pendingInvites) {
      teamList.push(invite.teamId);
    }
    this.setState({ pendingTeams: teamList });
  }

  async createNotifications() {
    let list = [];
    for (let team of this.state.pendingTeams) {
      let details = undefined;
      try {
        details = await TeamAPI.getTeam(team);
      } catch (error) {
        return;
      }
      if (details === undefined) {
        return;
      }
      if (details.length < 1) {
        return;
      }
      details = details[0];
      list.push(<Divider />);
      let listItem = (
        <ListItem>
          <ListItemText
            primary={
              "You have been invited to join " +
              details.teamName +
              ". Do you want to accept this invite?"
            }
          />
          <ListItemSecondaryAction>
            <IconButton
              aria-label="Accept Invite"
              onClick={this.handleClickAcceptInvite.bind(this, team)}
            >
              <CheckIcon />
            </IconButton>
            <IconButton
              aria-label="Delete Invite"
              onClick={this.handleClickDeclineInvite.bind(this, team)}
            >
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      );
      list.push(listItem);
    }
    this.setState({ notificationList: list });
  }

  async componentDidMount() {
    if (!Authentication.loggedIn()) {
      this.props.history.push("/login");
    }
    await this.getPendingInvites();
    if (this.state.pendingTeams != null) {
      await this.createNotifications();
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
          <h2>Notifications</h2>
          <div>
            {this.state.notificationList === null ? (
              <div>
                <CircularProgress />
              </div>
            ) : (
              <List>{this.state.notificationList}</List>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Notifications);
