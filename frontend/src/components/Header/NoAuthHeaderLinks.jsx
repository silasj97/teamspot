import * as S from './styles'

import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import Button from "components/Button/Button"
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
        <S.ButtonContainer>
          <Button
            text={'Register'}
            onClickFunction={() => this.handleClickOpen("registerModal")}
          />
          <Button
            text={'Login'}
            onClickFunction={() => this.handleClickOpen("loginModal")}
          />
        </S.ButtonContainer>
    
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
