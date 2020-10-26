import React, { useState, useEffect, useContext } from 'react';
import { Button, makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import ProspectsContext from '../../contexts/ProspectsContext';
import EnhancedDataTable from '../../components/EnhancedDataTable';
import buttonStyles from '../../assets/styles/buttonStyles';
import CsvUploadButton from '../../components/CsvUploadButton';
import UserContext from '../../contexts/UserContext';

const useStyles = makeStyles(() => ({
  mainGrid: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faded: {
    color: '#9e9e9e',
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
  // { id: 'id', numeric: false, disablePadding: false, label: 'id' },
  { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
  { id: 'firstName', numeric: false, disablePadding: false, label: 'First Name' },
  { id: 'lastName', numeric: false, disablePadding: false, label: 'Last Name' },
  { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
];

const ProspectsContent = () => {
  const classes = useStyles();
  const buttonClasses = buttonStyles();
  const [user] = useContext(UserContext);
  const [search] = useContext(ProspectsContext);
  const [data, setData] = useState(testData);
  const filteredData = data.filter((d) => d.email.includes(search));

  useEffect(() => {
    fetch(`/prospects?owner_email=${user.email}`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((d) => {
        const prospects = d.prospects.map((prospect) => ({
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
  }, [user.email]);

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
          <Grid className={classes.centered} container item xs={8}>
            <Grid item xs={8}>
              <CsvUploadButton />
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
    </>
  );
};

export default ProspectsContent;
