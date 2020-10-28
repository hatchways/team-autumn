import React, { useState, useEffect, useContext } from 'react';
import { Button, makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';
import { useHistory } from 'react-router-dom';

import FilterContext from '../../contexts/FilterContext';
import EnhancedDataTable from '../../components/EnhancedDataTable';
import buttonStyles from '../../assets/styles/buttonStyles';
import UserContext from '../../contexts/UserContext';
import ProspectUploadContext from '../../contexts/ProspectUploadContext';

const useStyles = makeStyles(() => ({
  mainGrid: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faded: {
    color: '#9e9e9e',
  },
  buttonRight: {
    justifyContent: 'flex-end',
  },
}));

const testData = [
  {
    email: 'steven@example.com',
    firstName: 'Steven',
    lastName: 'McGrath',
    status: 'open',
  },
  {
    email: 'carrie@example.com',
    firstName: 'Carrie',
    lastName: 'Pascale',
    status: 'responded',
  },
  {
    email: 'patton@example.com',
    firstName: 'Patton',
    lastName: 'L',
    status: 'responded',
  },
  {
    email: 'shums@example.com',
    firstName: 'Shums',
    lastName: 'Kassam',
    status: 'unsubscribed',
  },
];

const headCells = [
  { id: '_id', numeric: false, disablePadding: false, label: '_id' },
  { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
  { id: 'firstName', numeric: false, disablePadding: false, label: 'First Name' },
  { id: 'lastName', numeric: false, disablePadding: false, label: 'Last Name' },
  { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
];

const Alert = (props) => <MuiAlert elevation={6} variant="filled" {...props} />;

const ProspectsContent = () => {
  const classes = useStyles();
  const buttonClasses = buttonStyles();
  const { filterContext, itemContext, campaignContext } = useContext(FilterContext);
  const [data, setData] = useState(testData);
  const history = useHistory();

  const [filter] = filterContext;
  const [selectedItems] = itemContext;
  const [selectedCampaign] = campaignContext;

  const [message, setMessage] = useContext(ProspectUploadContext);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const { text } = message;
    if (text) {
      setOpen(true);
    }
  }, [message, setOpen]);

  const [user] = useContext(UserContext);
  useEffect(() => {
    if (user) {
      fetch(`/prospects`, {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((d) => {
          const prospects = d.prospects.map((prospect) => ({
            _id: prospect._id,
            email: prospect.email,
            firstName: prospect.first_name,
            lastName: prospect.last_name,
            status: prospect.status,
          }));
          if (prospects.length > 0) {
            setData(prospects);
          }
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  const filteredData = data.filter((d) => d.email.includes(filter));

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
    setMessage('');
  };

  const handleUploadProspects = () => {
    // TODO: Upload prospects on click
    if (selectedCampaign) {
      fetch(`/campaign/${selectedCampaign._id}/prospects_add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prospect_ids: selectedItems }),
      })
        .then((response) => response.json())
        .then((d) => console.log(d))
        .catch((err) => console.log(err));
    }
  };

  return (
    <>
      <Grid className={classes.mainGrid} container>
        <Typography component="h3" variant="h6">
          Prospects
        </Typography>
        <Grid className={classes.buttonGrid} item container xs={6}>
          <Grid item xs={4}>
            <Button variant="contained" className={`${buttonClasses.base} ${buttonClasses.action}`}>
              Add New Prospect
            </Button>
          </Grid>
          <Grid className={classes.buttonRight} container item xs={8}>
            <Grid item xs={8}>
              <Button
                variant="contained"
                className={`${buttonClasses.base} ${buttonClasses.action}`}
                onClick={() => history.push('/prospects/upload')}
              >
                Upload Prospects by File
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <EnhancedDataTable
        className={classes.table}
        data={filteredData}
        ariaLabel="prospects"
        headCells={headCells}
        requiresCheckbox
        initialSortBy="email"
      />
      <Button
        className={`${buttonClasses.base} ${buttonClasses.action} ${buttonClasses.extraWide}`}
        onClick={handleUploadProspects}
      >
        Add to Campaign
      </Button>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleClose} severity={message.type}>
          {message.text}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProspectsContent;
