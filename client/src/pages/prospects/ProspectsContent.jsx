import React, { useContext } from 'react';
import { Button, makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import ProspectsContext from '../../contexts/ProspectsContext';
import EnhancedDataTable from '../../components/EnhancedDataTable';
import buttonStyles from '../../assets/styles/buttonStyles';
import CsvUploadButton from '../../components/CsvUploadButton';

const useStyles = makeStyles((theme) => ({
  mainGrid: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonGrid: {
    flexBasis: 'auto',
    justifyContent: 'flex-end',
    marginRight: theme.spacing(-4),
  },
  faded: {
    color: '#9e9e9e',
  },
  centered: {
    justifyContent: 'center',
  },
}));

const testData = [
  {
    id: 1,
    email: 'steven@example.com',
    firstName: 'Steven',
    lastName: 'McGrath',
    status: 'open',
  },
  {
    id: 2,
    email: 'carrie@example.com',
    firstName: 'Carrie',
    lastName: 'Pascale',
    status: 'responded',
  },
  {
    id: 3,
    email: 'patton@example.com',
    firstName: 'Patton',
    lastName: 'L',
    status: 'responded',
  },
  {
    id: 4,
    email: 'shums@example.com',
    firstName: 'Shums',
    lastName: 'Kassam',
    status: 'unsubscribed',
  },
];

const headCells = [
  { id: 'id', numeric: false, disablePadding: false, label: 'id' },
  { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
  { id: 'firstName', numeric: false, disablePadding: false, label: 'First Name' },
  { id: 'lastName', numeric: false, disablePadding: false, label: 'Last Name' },
  { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
];

const ProspectsContent = () => {
  const classes = useStyles();
  const buttonClasses = buttonStyles();
  const [search] = useContext(ProspectsContext);
  const filteredData = testData.filter((d) => d.email.includes(search));
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
