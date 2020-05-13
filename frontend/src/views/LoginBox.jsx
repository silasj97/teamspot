import React from "react";
import { GoogleLogin } from "react-google-login";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormHelperText from "@material-ui/core/FormHelperText";
// @material-ui/icons
import { Email, LockOutlined } from "@material-ui/icons";
// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";

import loginBoxStyle from "assets/jss/views/loginBoxStyle.jsx";
import UserAuth from "components/API/UserAuth.js";

class LoginBox extends React.Component {
  constructor(props) {
    super(props);
    // use this to make the card to appear after the page has been rendered
    this.state = {
      cardAnimaton: "",
      submitted: false,
      formError: "",
      APIBusy: false
    };
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.googleLogin = this.googleLogin.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  async handleFormSubmit(e) {
    e.preventDefault();
    this.setState({ submitted: true, APIBusy: true });
    try {
      const { loginEmail, loginPassword } = this.state;
      await UserAuth.login(loginEmail, loginPassword);
      window.location.reload();
    } catch (error) {
      this.setState({ formError: error.message });
    }
    this.setState({ APIBusy: false });
  }

  async googleLogin(response) {
    this.setState({ APIBusy: true });
    if (
      response.tokenObj !== undefined &&
      response.tokenObj.id_token !== undefined
    ) {
      try {
        await UserAuth.googleLogin(response.tokenObj.id_token);
        window.location.reload();
      } catch (error) {
        this.setState({ formError: "Error logging in with Google" });
      }
      this.setState({ APIBusy: false });
    } else {
      this.setState({ formError: "Error logging in with Google" });
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <div className={classes.container}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={10}>
              <Card className={classes[this.state.cardAnimaton]}>
                <form className={classes.form} onSubmit={this.handleFormSubmit}>
                  <CardHeader color="primary" className={classes.cardHeader}>
                    <h2>Login</h2>
                  </CardHeader>
                  <CardBody>
                    <center>
                      <GoogleLogin
                        clientId="802305630809-pdjvhcuo362ii6qfo0617u4ag8fgttad.apps.googleusercontent.com"
                        buttonText="Login with Google"
                        onSuccess={this.googleLogin}
                        onFailure={this.googleLogin}
                      />
                    </center>
                    <FormHelperText error>
                      {this.state.formError}
                    </FormHelperText>
                    <CustomInput
                      labelText="Email"
                      id="loginEmail"
                      name="loginEmail"
                      onChange={this.handleChange.bind(this)}
                      formHelperText={
                        this.state.submitted && !this.state.loginEmail
                          ? "Email is required"
                          : undefined
                      }
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "email",
                        endAdornment: (
                          <InputAdornment position="end">
                            <Email className={classes.inputIconsColor} />
                          </InputAdornment>
                        )
                      }}
                    />
                    <CustomInput
                      labelText="Password"
                      id="loginPassword"
                      name="loginPassword"
                      onChange={this.handleChange.bind(this)}
                      formHelperText={
                        this.state.submitted && !this.state.loginPassword
                          ? "Password is required"
                          : undefined
                      }
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "password",
                        endAdornment: (
                          <InputAdornment position="end">
                            <LockOutlined className={classes.inputIconsColor} />
                          </InputAdornment>
                        )
                      }}
                    />
                  </CardBody>
                  <CardFooter className={classes.cardFooter}>
                    <Button
                      simple
                      color="primary"
                      size="lg"
                      value="submit"
                      type="submit"
                    >
                      Login
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
      </div>
    );
  }
}

export default withStyles(loginBoxStyle)(LoginBox);
