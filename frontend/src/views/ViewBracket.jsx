import React from "react";

// core components
import Header from "components/Header/Header.jsx";
import NoAuthHeaderLinks from "components/Header/NoAuthHeaderLinks.jsx";
import AuthHeaderLinks from "components/Header/AuthHeaderLinks.jsx";
import Authentication from "components/API/Authentication.js";
import MatchAPI from "components/API/MatchAPI.js";
import TournamentBracket from "components/Tournament/TournamentBracket.jsx";

class ViewBracket extends React.Component {
  constructor(props) {
    super(props);
    this.state = { matches: [] };
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  async componentDidMount() {
    try {
      const matches = await MatchAPI.getMatches(
        this.props.match.params.tournamentID
      );
      this.setState({ matches });
    } catch (error) {
      // pass
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
          <TournamentBracket matchesList={this.state.matches} />
        </div>
      </div>
    );
  }
}

export default ViewBracket;
