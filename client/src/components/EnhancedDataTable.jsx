import React, { useContext, useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';

import { tableStyles } from '../assets/styles';
import generateUniqueId from '../util/generateUniqueId';
import FilterContext from '../contexts/FilterContext';

const createData = (datum) => ({ ...datum });

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

const getComparator = (order, orderBy) =>
  order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);

const stableSort = (array, comparator) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
};

const EnhancedTableHead = ({
  classes,
  onSelectAllClick,
  order,
  orderBy,
  numSelected,
  rowCount,
  onRequestSort,
  ariaLabel,
  headCells,
  requiresCheckbox,
}) => {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead className={classes.head}>
      <TableRow className={classes.tableRow}>
        {requiresCheckbox && (
          <TableCell className={classes.tableCell} padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{ 'aria-label': `select all ${ariaLabel}` }}
            />
          </TableCell>
        )}

        {headCells.map((headCell) => (
          <TableCell
            className={`${classes.tableCell} ${
              headCell.id === '_id' ? classes.visuallyHidden : ''
            }`}
            key={`prospect-${headCell.id}`}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.email ? order : false}
          >
            <TableSortLabel
              className={classes.sortLabel}
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

const EnhancedDataTable = ({
  data,
  ariaLabel,
  headCells,
  requiresCheckbox,
  initialSortBy = 'email',
}) => {
  const classes = tableStyles();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState(initialSortBy);
  const { itemContext } = useContext(FilterContext);

  const [selectedItems, setSelectedItems] = itemContext;

  const rows = data.map((datum) => createData(datum));

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((r) => r._id);
      setSelectedItems(newSelecteds);
      return;
    }
    setSelectedItems([]);
  };

  const handleClick = (event, _id) => {
    const selectedIndex = selectedItems.indexOf(_id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedItems, _id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedItems.slice(1));
    } else if (selectedIndex === selectedItems.length - 1) {
      newSelected = newSelected.concat(selectedItems.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedItems.slice(0, selectedIndex),
        selectedItems.slice(selectedIndex + 1)
      );
    }

    setSelectedItems(newSelected);
    console.log(selectedItems);
  };

  const isSelected = (_id) => selectedItems.indexOf(_id) !== -1;

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableContainer className={classes.container}>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size="medium"
            aria-label={`${ariaLabel} table`}
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selectedItems?.length || 0}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              ariaLabel={ariaLabel}
              headCells={headCells}
              requiresCheckbox={requiresCheckbox}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy)).map((row) => {
                const isItemSelected = isSelected(row._id);
                const labelId = row._id;
                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row._id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={generateUniqueId('prospect')}
                    selected={isItemSelected}
                  >
                    {requiresCheckbox && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>
                    )}

                    <TableCell
                      className={classes.visuallyHidden}
                      component="th"
                      align="left"
                      id={labelId}
                      scope="row"
                    >
                      {row._id}
                    </TableCell>
                    {Object.entries(row)
                      .filter((e) => e[0] !== '_id')
                      .map((entry) => (
                        <TableCell key={entry[1]}>{entry[1]}</TableCell>
                      ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
};

export default EnhancedDataTable;
