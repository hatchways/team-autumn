import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import RichTextEditorPopup from '../../components/RichTextEditorPopup';
import { buttonStyles, cardStyles, campaignStyles } from '../../assets/styles';

const StatCard = ({ stat }) => {
  const classes = cardStyles();
  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          {stat.name}
        </Typography>
        <Typography variant="h5" component="h2">
          {stat.value}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          {stat.name !== 'prospects' ? `(${stat.percent} %)` : ''}
        </Typography>
      </CardContent>
    </Card>
  );
};

const CampaignContent = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [currentCampaign, setCurrentCampaign] = useState();

  const pathSegments = location.pathname.split('/');
  const campaignId = pathSegments[pathSegments.length - 1];

  const campaignClasses = campaignStyles();
  const buttonClasses = buttonStyles();

  useEffect(() => {
    fetch('/user/campaign_by_id', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ campaign_id: campaignId }),
    })
      .then((response) => response.json())
      .then((d) => {
        const campaignInfo = d.response;
        setCurrentCampaign({
          name: campaignInfo.name,
          prospects: campaignInfo.prospects,
          stats: {
            prospects: campaignInfo.num_prospects,
            reached: campaignInfo.num_reached,
            replied: campaignInfo.num_reply,
          },
        });
        setLoading(false);
      })
      .catch((err) => {
        setCurrentCampaign({ campaign: {}, stats: {} });
        setLoading(false);
      });
  }, [location.pathname, campaignId]);

  const transformStats = (stats) => {
    console.log(stats);
    console.log(currentCampaign);
    return Object.entries(stats).map((stat) => ({
      name: stat[0],
      value: stat[1],
      percent: ((100 * stat[1]) / stats.prospects).toFixed(2),
    }));
  };

  if (!loading) {
    return (
      <Container maxWidth="lg" component="main">
        <div className={campaignClasses.paper}>
          <Grid direction="column" spacing={2} container>
            <Grid item>
              <Typography className={campaignClasses.sectionHeading} variant="h5" component="h2">
                Campaign Summary
              </Typography>
            </Grid>
            <Grid item container spacing={1}>
              <Grid container item xs={12}>
                {transformStats(currentCampaign?.stats).map((stat) => (
                  <Grid key={stat.name} item xs={3}>
                    <StatCard stat={stat} />
                  </Grid>
                )) || ''}
              </Grid>
            </Grid>
            <Grid item>
              <Typography className={campaignClasses.sectionHeading} variant="h5" component="h2">
                Steps List
              </Typography>
            </Grid>
            <Grid item>
              <Button
                className={`${buttonClasses.base} ${buttonClasses.action} ${buttonClasses.extraWide}`}
                onClick={() => setOpen(true)}
              >
                Add Step
              </Button>
            </Grid>
          </Grid>
          <RichTextEditorPopup open={open} onClose={() => setOpen(false)} />
        </div>
      </Container>
    );
  }

  return (
    <Backdrop className={campaignClasses.backdrop} open={loading}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default CampaignContent;
