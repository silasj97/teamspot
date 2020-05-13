import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  withRouter
} from "react-router-dom";
import { MuiThemeProvider } from "@material-ui/core/styles";
import theme from "assets/jss/theme";
import "./App.css";

// Pages
import HomePage from "./views/HomePage/HomePage";
import TournamentDetails from "views/TournamentDetails";
import MatchDetails from "views/MatchDetails";
import TournamentCreate from "views/TournamentCreate";
import TournamentEdit from "views/TournamentEdit";
import NotFound from "views/NotFound";
import MatchCreate from "views/MatchCreate";
import MatchEdit from "views/MatchEdit";
import TeamCreate from "views/TeamCreate";
import TeamDetails from "views/TeamDetails";
import TeamInvite from "views/TeamInvite";
import Notifications from "views/Notifications";
import TournamentReferees from "views/TournamentReferees";
import TournamentRefereeAdd from "views/TournamentRefereeAdd";
import ViewBracket from "views/ViewBracket";

class App extends Component {
  render() {
    return (
      <div className="App">
        <MuiThemeProvider theme={theme}>
          <Router>
            <Switch>
              <Route path="/" exact component={HomePage} />
              {/* <Route
                path="/login"
                render={props => <HomePage {...props} login={true} />}
              />
              <Route
                path="/register"
                render={props => <HomePage {...props} register={true} />}
              />
              <Route path="/notifications" exact component={Notifications} />
              <Route path="/tournament" exact component={HomePage} />
              <Route
                path="/tournament/create"
                exact
                component={TournamentCreate}
              />
              <Route
                path="/tournament/:tournamentID"
                exact
                component={TournamentDetails}
              />
              <Route
                path="/tournament/:tournamentID/edit"
                exact
                component={TournamentEdit}
              />
              <Route
                path="/tournament/:tournamentID/match/create"
                exact
                component={MatchCreate}
              />
              <Route
                path="/tournament/:tournamentID/match/:matchID"
                exact
                component={MatchDetails}
              />
              <Route
                path="/tournament/:tournamentID/match/:matchID/edit"
                exact
                component={MatchEdit}
              />
              <Route
                path="/tournament/:tournamentID/bracket"
                exact
                component={ViewBracket}
              />
              <Route
                path="/tournament/:tournamentID/team/create"
                exact
                component={TeamCreate}
              />
              <Route
                path="/tournament/:tournamentID/referees"
                exact
                component={TournamentReferees}
              />
              <Route
                path="/tournament/:tournamentID/referees/add"
                exact
                component={TournamentRefereeAdd}
              />
              <Route path="/team/:teamID" exact component={TeamDetails} />
              <Route path="/team/:teamID/invite" exact component={TeamInvite} />
              <Route component={NotFound} /> */}
            </Switch>
          </Router>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default withRouter(App);
