import { makeStyles } from '@material-ui/core';

export const formStyles = makeStyles((theme) => ({
  root: {
    justifyContent: 'center',
  },
  title: {
    fontWeight: 600,
  },
  paper: {
    marginTop: theme.spacing(12),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: '4rem 0',
    borderRadius: '5px',
  },
  form: {
    width: '75%', // Fix IE 11 issue.
    marginTop: theme.spacing(8),
  },
  action: {
    margin: theme.spacing(3, 0, 2),
    background: `linear-gradient(90deg, ${theme.palette.primary.dark} , ${theme.palette.primary.light})`,
    color: 'white',
    height: '3rem',
    fontWeight: 600,
    textTransform: 'none',
    borderRadius: '5px',
  },
  centered: {
    justifyContent: 'center',
  },
  linkText: {
    textAlign: 'right',
  },
  uploadPaper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: '1rem 0',
    borderRadius: '5px',
  },
}));

export const headerStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.background.paper,
    color: 'black',
    flexGrow: 1,
  },
  link: {
    textDecoration: 'none',
    color: 'black',
  },
  logo: {
    fontWeight: 600,
    fontSize: '1.2rem',
    flexGrow: 1,
    marginLeft: theme.spacing(2),
  },
  logoSecond: {
    color: '#4FBE75',
  },
  message: {
    marginRight: theme.spacing(3),
    fontSize: '0.8rem',
  },
  loginButton: {
    textTransform: 'none',
    fontWeight: 600,
    marginRight: theme.spacing(2),
    width: '7.5rem',
    height: '2.5rem',
  },
  profileButton: {
    textTransform: 'none',
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
  dropdownIcon: {
    color: '#9e9e9e',
  },
  tabLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    color: 'black',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

export const buttonStyles = makeStyles((theme) => ({
  base: {
    textTransform: 'none',
    height: '3rem',
    fontWeight: 600,
    borderRadius: '5px',
    margin: theme.spacing(3, 0, 2),
  },
  action: {
    background: `linear-gradient(90deg, ${theme.palette.primary.dark} , ${theme.palette.primary.light})`,
    color: 'white',
  },
  extraWide: {
    width: '150px',
  },
}));

export const tableStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(8),
  },
  paper: {
    marginBottom: theme.spacing(2),
  },
  table: {
    borderRadius: theme.shape.borderRadius,
    minWidth: 650,
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
    maxHeight: 500,
    padding: theme.spacing(1),
  },
  tableRow: {
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  },
  uploadContainer: {
    maxHeight: 350,
    padding: theme.spacing(1),
  },
}));

export const contentTemplateStyles = makeStyles(() => ({
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
  flexEnd: {
    flexBasis: 'auto',
  },
}));
