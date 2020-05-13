import React from "react";
import { withRouter } from "react-router-dom";

// @material-ui/core components
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import withStyles from "@material-ui/core/styles/withStyles";
import IconButton from "@material-ui/core/IconButton";
import AccountCircle from "@material-ui/icons/AccountCircle";
import NotificationIcon from "@material-ui/icons/Notifications";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
// core components
import headerLinksStyle from "assets/jss/components/headerLinksStyle.jsx";
import UserAuth from "components/API/UserAuth.js";
import TeamAPI from "components/API/TeamAPI.js";

class AuthHeaderLinks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      amchorEl2: null,
      notificationCount: 0
    };
    this.handleViewNotifications = this.handleViewNotifications.bind(this);
  }

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenu2 = event => {
    this.setState({ anchorEl2: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null, anchorEl2: null });
  };

  handleLogout = () => {
    this.setState({ anchorEl: null });
    UserAuth.logout();
    window.location.reload();
  };

  handleViewNotifications() {
    this.props.history.push("/notifications");
  }

  async componentDidMount() {
    let pendingInvites;
    try {
      pendingInvites = await TeamAPI.getPendingInvites();
    } catch (error) {
      return;
    }
    if (pendingInvites === undefined || pendingInvites.length < 1) {
      return;
    } else {
      this.setState({ notificationCount: pendingInvites.length });
    }
  }

  render() {
    const { classes } = this.props;
    const { anchorEl, anchorEl2 } = this.state;
    const open = Boolean(anchorEl);
    const open2 = Boolean(anchorEl2);
    return (
      <div>
        <List className={classes.list}>
          <ListItem className={classes.listItem}>
            <div>
              <IconButton
                aria-owns={open2 ? "menu-appbar2" : null}
                aria-haspopup="true"
                onClick={this.handleMenu2}
                color="inherit"
              >
                <Badge badgeContent={this.state.notificationCount}>
                  <NotificationIcon />
                </Badge>
              </IconButton>
              <Menu
                id="menu-appbar2"
                anchorEl={anchorEl2}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right"
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right"
                }}
                open={open2}
                onClose={this.handleClose}
              >
                <MenuItem onClick={this.handleViewNotifications}>
                  View Notifications
                </MenuItem>
              </Menu>
            </div>
          </ListItem>
          <ListItem className={classes.listItem}>
            <div>
              <IconButton
                aria-owns={open ? "menu-appbar" : null}
                aria-haspopup="true"
                onClick={this.handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right"
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right"
                }}
                open={open}
                onClose={this.handleClose}
              >
                <MenuItem onClick={this.handleClose}>Settings</MenuItem>
                <MenuItem onClick={this.handleLogout}>Sign out</MenuItem>
              </Menu>
            </div>
          </ListItem>
        </List>
      </div>
    );
  }
}

export default withRouter(withStyles(headerLinksStyle)(AuthHeaderLinks));
