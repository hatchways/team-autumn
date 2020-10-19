import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Grid,
  Card,
  CardContent,
  Container,
  Typography,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
  },
  body: {
    fontSize: 40,
  },
}));

const campaign = {
  id: 0,
  title: "Nature interesteds prospects",
  steps: { id: 0, sent: 146, opened: "36%", clicked: "146%", replied: "2%" },
  stats: [
    { id: 0, name: "Contacted", number: 146 },
    { id: 1, name: "Reached", number: 145 },
    { id: 2, name: "Opened", number: 52 },
    { id: 3, name: "Replied", number: 3 },
  ],
};

const StatsCard = ({ ...stat }) => {
  const classes = useStyles();

  return (
    <Grid item xs={3}>
      <Card>
        <CardContent>
          <Typography className={classes.title}>{stat.name}</Typography>
          <Typography className={classes.body} color="primary">
            {stat.number}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

// props: { campaign }
const ViewCampaign = () => {
  const classes = useStyles();

  return (
    <Container maxWidth="lg">
      <Grid container spacing={0}>
        {campaign.stats.map((s) => (
          <StatsCard key={s.id} {...s} />
        ))}
      </Grid>
    </Container>
  );
};

export default ViewCampaign;
