import { makeStyles } from '@material-ui/core';

// TODO: add styling to .MuiTableContainer-root - remove overflow

const tableStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(8),
    '&.MuiTableContainer-root': {
      width: '100%',
    },
  },
  paper: {
    marginBottom: theme.spacing(2),
  },
  table: {
    borderRadius: theme.shape.borderRadius,
  },
  head: {
    backgroundColor: theme.palette.primary.main,
    borderRadius: theme.shape.borderRadius,
  },
  headText: {
    fontWeight: 600,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  blank: {
    display: 'none',
  },
  container: {
    maxHeight: 650,
    padding: theme.spacing(1),
  },
  tableRow: {
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  },
  tableCell: {
    color: 'white',
    fontWeight: 600,
    '&.MuiTableSortLabel-root.MuiTableSortLabel-active': {
      color: 'white',
    },
  },
}));

export default tableStyles;