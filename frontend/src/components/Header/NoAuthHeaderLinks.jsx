import React from "react";

// @material-ui/core components
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import Button from "components/CustomButtons/Button.jsx";
import headerLinksStyle from "assets/jss/components/headerLinksStyle.jsx";

import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";

import LoginBox from "views/LoginBox.jsx";
import RegisterBox from "views/RegistrationBox.jsx";

//const dashboardRoutes = [];

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class NoAuthHeaderLinks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginModal: props.loginPage ? props.loginPage : false,
      registerModal: props.registerPage ? props.registerPage : false
    };
  }
  handleClickOpen(modal) {
    var x = [];
    x[modal] = true;
    this.setState(x);
  }
  handleClose(modal) {
    var x = [];
    x[modal] = false;
    this.setState(x);
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <List className={classes.list}>
          <ListItem className={classes.listItem}>
            <Button
              color="gold"
              width="100%"
              className={classes.navLink}
              onClick={() => this.handleClickOpen("registerModal")}
            >
              Register
            </Button>
          </ListItem>
          <ListItem className={classes.listItem}>
            <Button
              color="gold"
              width="100%"
              className={classes.navLink}
              onClick={() => this.handleClickOpen("loginModal")}
            >
              Login
            </Button>
          </ListItem>
        </List>
        <Dialog
          classes={{
            root: classes.center,
            paper: classes.modal
          }}
          open={this.state.loginModal}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => this.handleClose("loginModal")}
        >
          <div>
            <LoginBox />
          </div>
        </Dialog>
        <Dialog
          classes={{
            root: classes.center,
            paper: classes.modal
          }}
          open={this.state.registerModal}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => this.handleClose("registerModal")}
        >
          <div>
            <RegisterBox />
          </div>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(headerLinksStyle)(NoAuthHeaderLinks);
