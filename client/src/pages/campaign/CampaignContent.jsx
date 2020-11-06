import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import socketIOClient from 'socket.io-client';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import Snackbar from '@material-ui/core/Snackbar';

import { buttonStyles, cardStyles, campaignStyles } from '../../assets/styles';
import Alert from '../../components/Alert';

const ENDPOINT = 'http://localhost:3000';

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

const StepCard = ({ step, index }) => {
  const classes = cardStyles();
  return (
    <Card style={{ width: '100%' }}>
      <CardContent>
        <Grid container direction="row">
          <Grid item xs={2}>
            <MailOutlineIcon color="primary" fontSize="large" />
          </Grid>
          <Grid item xs={3}>
            <Typography className={classes.title} color="textSecondary">
              {step.subject}
            </Typography>
          </Grid>
          <Grid item xs={7}>
            <Typography className={classes.title} color="textSecondary">
              {`Prospects: ${step.prospects?.length || 0}`}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const CampaignContent = () => {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [currentCampaign, setCurrentCampaign] = useState();
  const [socketResponse, setSocketResponse] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [open, setOpen] = useState(false);

  const pathSegments = location.pathname.split('/');
  const campaignId = pathSegments[pathSegments.length - 1];

  const history = useHistory();

  const campaignClasses = campaignStyles();
  const buttonClasses = buttonStyles();

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);

    socket.on('sent_email_status', (data) => {
      console.log(data);
      setSocketResponse(data);
      setMessage({ type: 'info', text: 'Email sent successfully' });
      setOpen(true);
    });
    socket.on('new_email_reply', (data) => {
      console.log(data);
      setSocketResponse(data);
      setMessage({ type: 'info', text: 'Prospect replied!' });
      setOpen(true);
    });
    return () => {
      socket.on('disconnect', () => console.log('disconnected'));
    };
  }, [setSocketResponse]);

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
          id: campaignInfo._id,
          name: campaignInfo.name,
          prospects: campaignInfo.prospects,
          stats: {
            prospects: campaignInfo.num_prospects,
            sent: campaignInfo.num_reached,
            replied: campaignInfo.num_reply,
          },
          steps: campaignInfo.steps,
        });
        setLoading(false);
      })
      .catch((err) => {
        setCurrentCampaign({ campaign: {}, stats: {} });
        setLoading(false);
      });
  }, [location.pathname, campaignId]);

  const transformStats = (stats) =>
    Object.entries(stats).map((stat) => ({
      name: stat[0],
      value: stat[1],
      percent: ((100 * stat[1]) / stats.prospects).toFixed(2),
    }));

  const handleAddProspectsToStep = (stepIndex) => {
    const prospectIds = currentCampaign.steps[stepIndex].prospects || [];
    if (prospectIds.length > 0) {
      // setMessage({ type: 'warning', text: 'Prospects have already been added to this step' });
      console.log('nope');
    } else {
      setLoading(true);
      fetch(`/campaign/${currentCampaign.id}/prospects_auto_add_to_step`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ step_index: stepIndex }),
      })
        .then((response) => response.json())
        .then(() => setLoading(false))
        .catch(() => setLoading(false));
    }
  };

  const handleSendEmail = (stepIndex) => {
    fetch(`/campaign/${currentCampaign.id}/steps_send`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ step_index: stepIndex }),
    })
      .then((response) => response.json())
      .then(() => console.log('Sent'))
      .catch((err) => console.log(err));
  };

  if (!loading && currentCampaign) {
    const steps = currentCampaign.steps || [];
    const stats = currentCampaign.stats || [];
    return (
      <>
        <Container maxWidth="lg" component="main">
          <div className={campaignClasses.paper}>
            <Grid direction="column" spacing={2} container>
              <Grid item>
                <Typography className={campaignClasses.sectionHeading} variant="h5" component="h2">
                  {currentCampaign.name}
                </Typography>
              </Grid>
              <Grid item container spacing={1}>
                <Grid container item xs={12}>
                  {transformStats(stats).map((stat) => (
                    <Grid key={stat.name} item xs={4}>
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
                {steps.map((step, i) => (
                  <div key={`step-${i}`}>
                    <StepCard step={step} index={i + 1} />
                    <Grid container direction="row">
                      <Grid item xs={3}>
                        <Button
                          className={`${buttonClasses.base} ${buttonClasses.action} ${buttonClasses.extraWide}`}
                          onClick={() => handleAddProspectsToStep(i)}
                        >
                          Add Prospects
                        </Button>
                      </Grid>
                      <Grid item xs={3}>
                        {step.prospects?.length > 0 && (
                          <Button
                            className={`${buttonClasses.base} ${buttonClasses.action} ${buttonClasses.extraWide}`}
                            onClick={() => handleSendEmail(i)}
                          >
                            Send Email
                          </Button>
                        )}
                      </Grid>
                    </Grid>
                  </div>
                ))}
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  className={`${buttonClasses.base} ${buttonClasses.extraWide}`}
                  onClick={() => history.push(`/campaigns/${currentCampaign.id}/add_step`)}
                >
                  Add Step
                </Button>
              </Grid>
            </Grid>
          </div>
        </Container>
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={() => setOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert onClose={() => setOpen(false)} severity={message.type}>
            {message.text}
          </Alert>
        </Snackbar>
      </>
    );
  }

  return (
    <Backdrop className={campaignClasses.backdrop} open={loading}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default CampaignContent;
