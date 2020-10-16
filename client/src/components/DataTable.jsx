import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(8),
  },
  table: {
    minWidth: 1000,
  },
}));

const createData = (datum) => ({ ...datum });

const DataTable = ({ data, primaryHeader, otherHeaders }) => {
  const classes = useStyles();

  const rows = data.map((datum) => createData(datum));

  return (
    <TableContainer className={classes.root} component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>{primaryHeader}</TableCell>
            {otherHeaders
              .filter((h) => h !== 'id')
              .map((header) => (
                <TableCell align="right">{header}</TableCell>
              ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">
                {row.id}
              </TableCell>
              {Object.entries(row)
                .filter((e) => e[0] !== 'id')
                .map((entry) => (
                  <TableCell align="right">{entry[1]}</TableCell>
                ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;
