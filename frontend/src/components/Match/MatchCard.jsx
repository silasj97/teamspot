import React from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

import matchCardStyle from "assets/jss/components/matchCardStyle.jsx";

class MatchCard extends React.Component {
  handleClick(id) {
    this.props.history.push(
      `/tournament/${this.props.match.params.tournamentID}/match/${id}`
    );
  }

  render() {
    const { classes, tournamentMatch } = this.props;
    const timeString = tournamentMatch.matchTime
      ? new Date(
          tournamentMatch.matchTime.slice(0, 19).replace("T", " ") + " UTC"
        ).toLocaleString()
      : "";
    const matchName =
      `Match ${tournamentMatch.id}: ` +
      (tournamentMatch.matchName ||
        `${tournamentMatch.teamA.teamName || "~Bye~"} vs. ${tournamentMatch
          .teamB.teamName || "~Bye~"}`);
    return (
      <Card className={classes.card}>
        <CardActionArea onClick={() => this.handleClick(tournamentMatch.id)}>
          <CardContent>
            <Typography className={classes.title} component="h1">
              {matchName}
            </Typography>
            <Typography color="textSecondary">{timeString}</Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  }
}

export default withRouter(withStyles(matchCardStyle)(MatchCard));
