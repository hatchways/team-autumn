import React, { useContext } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import ProspectsContext from '../../contexts/ProspectsContext';
import EnhancedDataTable from '../../components/EnhancedDataTable';

const testData = [
  {
    id: 1,
    email: 'steven@example.com',
    firstName: 'Steven',
    lastName: 'McGrath',
    lastContacted: '7/27/2020',
    status: 'open',
  },
  {
    id: 2,
    email: 'carrie@example.com',
    firstName: 'Carrie',
    lastName: 'Pascale',
    lastContacted: '10/11/2020',
    status: 'open',
  },
  {
    id: 3,
    email: 'patton@example.com',
    firstName: 'Patton',
    lastName: 'L',
    lastContacted: '9/13/2020',
    status: 'open',
  },
  {
    id: 4,
    email: 'shums@example.com',
    firstName: 'Shums',
    lastName: 'Kassam',
    lastContacted: '9/04/2020',
    status: 'open',
  },
];

const headCells = [
  { id: 'id', numeric: false, disablePadding: true, label: 'id' },
  { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
  { id: 'firstName', numeric: false, disablePadding: false, label: 'First Name' },
  { id: 'lastName', numeric: false, disablePadding: false, label: 'Last Name' },
  { id: 'lastContacted', numeric: false, disablePadding: false, label: 'Last Contacted' },
  { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
];

const ProspectsContent = () => {
  const [search] = useContext(ProspectsContext);
  const filteredData = testData.filter((d) => d.email.includes(search));
  return (
    <>
      <Typography variant="h3">Prospects</Typography>
      <div>
        <Button variant="outlined">Imports</Button>
        <Button variant="contained" color="secondary">
          Add new prospect
        </Button>
      </div>
      <EnhancedDataTable data={filteredData} ariaLabel="prospects" headCells={headCells} />
    </>
  );
};

export default ProspectsContent;
