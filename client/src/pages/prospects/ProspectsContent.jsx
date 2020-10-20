import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import ProspectsContext from '../../contexts/ProspectsContext';
import EnhancedDataTable from '../../components/EnhancedDataTable';
import ComboButton from '../../components/ComboButton';

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
    id: 1,
    email: 'steven@example.com',
    firstName: 'Steven',
    lastName: 'McGrath',
    lastContacted: '7/27/2020',
  },
  {
    id: 2,
    email: 'carrie@example.com',
    firstName: 'Carrie',
    lastName: 'Pascale',
    lastContacted: '10/11/2020',
  },
  {
    id: 3,
    email: 'patton@example.com',
    firstName: 'Patton',
    lastName: 'L',
    lastContacted: '9/13/2020',
  },
  {
    id: 4,
    email: 'shums@example.com',
    firstName: 'Shums',
    lastName: 'Kassam',
    lastContacted: '9/04/2020',
  },
];

const headCells = [
  { id: 'id', numeric: false, disablePadding: false, label: 'id' },
  { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
  { id: 'firstName', numeric: false, disablePadding: false, label: 'First Name' },
  { id: 'lastName', numeric: false, disablePadding: false, label: 'Last Name' },
  { id: 'lastContacted', numeric: false, disablePadding: false, label: 'Last Contacted' },
];

const options = ['Upload new prospect', 'Upload prospects from file'];

const ProspectsContent = () => {
  const classes = useStyles();
  const [search] = useContext(ProspectsContext);
  const filteredData = testData.filter((d) => d.email.includes(search));
  return (
    <>
      <Grid className={classes.mainGrid} container>
        <Typography component="h3" variant="h6">
          Prospects
        </Typography>
        <ComboButton ariaLabel="upload prospects" options={options} />
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
