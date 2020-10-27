import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { tableStyles } from '../assets/styles';
import generateUniqueId from '../util/generateUniqueId';

export default function DenseTable({ data }) {
  const classes = tableStyles();

  return (
    <TableContainer className={classes.uploadContainer} component={Paper}>
      <Table className={classes.table} size="small" aria-label="prospects table">
        <TableBody>
          {data.map((row) => (
            <TableRow key={generateUniqueId('uploaded-prospect')}>
              <TableCell component="th" scope="row">
                {row[0]}
              </TableCell>
              <TableCell align="right">{row[1]}</TableCell>
              <TableCell align="right">{row[2]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
