import React from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

import tournamentCardStyle from "assets/jss/components/tournamentCardStyle.jsx";

class TournamentCard extends React.Component {
  handleClick(id) {
    this.props.history.push(`/tournament/${id}`);
  }

  render() {
    const { classes, id, name, sponsor, date } = this.props;
    return (
      <Card className={classes.card}>
        <CardActionArea onClick={() => this.handleClick(id)}>
          <CardContent>
            <Typography className={classes.title} component="h1">
              {name}
            </Typography>
            <Typography color="textSecondary">
              {sponsor + " · " + date}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  }
}

export default withRouter(withStyles(tournamentCardStyle)(TournamentCard));
