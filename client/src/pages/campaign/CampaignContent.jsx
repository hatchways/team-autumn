import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Grid,
  Paper,
  Card,
  CardContent,
  Container,
  Typography,
} from "@material-ui/core";

import RichTextEditorPopup from "../../components/RichTextEditorPopup";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginTop: theme.spacing(12),
  },
  paper: {
    padding: theme.spacing(10),
    width: "60vw",
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  stats: {
    marginBottom: theme.spacing(12),
  },
  title: {
    fontSize: 22,
  },
  body: {
    fontSize: 40,
  },
  secondaryButton: {
    padding: "1em",
    color: "black",
    fontWeight: "bold",
  },
  cardContainer: {
    marginBottom: theme.spacing(12),
  },
}));

const campaign = {
  id: 0,
  title: "Nature interesteds prospects",
  steps: [
    {
      id: 0,
      subject: "Showing you around",
      content: "Sample email. I am going to be edited in a rich text editor.",
      type: "New thread",
      sent: 146,
      opened: "36%",
      clicked: "146%",
      replied: "2%",
      thread: [
        {
          id: 0,
          subject: "You didn't respond to my first email",
          content: "I am just checking in...",
          type: "Follow up",
          sent: 34,
          opened: "35%",
          clicked: "16%",
          replied: "6%",
          thread: [],
        },
      ],
    },
  ],
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
    <Card>
      <CardContent
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography className={classes.title}>{stat.name}</Typography>
        <Typography className={classes.body} color="primary">
          {stat.number}
        </Typography>
      </CardContent>
    </Card>
  );
};

// props: { id }
const ViewCampaign = () => {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(!open);
  };
  const classes = useStyles();

  return (
    <Container maxWidth="lg" className={classes.root}>
      <Grid container direction="column" spacing={3}>
        <Grid container spacing={0} className={classes.stats}>
          {campaign.stats.map((s) => (
            <Grid item xs={3}>
              <StatsCard key={s.id} {...s} />
            </Grid>
          ))}
        </Grid>

        <Grid item xs={12} className={classes.stats}>
          <Paper className={classes.paper}>Steps info to go here</Paper>
        </Grid>

        <Grid item>
          <div style={{ width: "25%", margin: "1em" }}>
            <Button
              fullWidth
              className={classes.secondaryButton}
              variant="outlined"
              color="primary"
              onClick={handleOpen}
            >
              Add step
            </Button>
          </div>
        </Grid>
        <RichTextEditorPopup
          title={"Step 1"}
          content={campaign.steps[0].content}
          setOpen={setOpen}
          open={open}
          onClose={handleClose}
        />
      </Grid>
    </Container>
  );
};

export default ViewCampaign;
