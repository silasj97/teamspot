import React from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

import teamCardStyle from "assets/jss/components/teamCardStyle.jsx";

class TeamCard extends React.Component {
  handleClick(id) {
    this.props.history.push(`/team/${id}`);
  }

  render() {
    const { classes, id, teamName } = this.props;
    return (
      <Card className={classes.card}>
        <CardActionArea onClick={() => this.handleClick(id)}>
          <CardContent>
            <Typography className={classes.title} component="h1">
              {teamName}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  }
}

export default withRouter(withStyles(teamCardStyle)(TeamCard));
