import { makeStyles } from '@material-ui/core';

const headerStyles = makeStyles((theme) => ({
  root: {
    position: 'fixed',
    background: theme.palette.background.paper,
    color: 'black',
    flexGrow: 1,
    zIndex: 1,
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
}));

export default headerStyles;
