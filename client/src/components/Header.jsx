import React from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    background: 'white',
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
}));

const Header = () => {
  const classes = useStyles();

  return (
    <AppBar className={classes.root} position="static">
      <Toolbar>
        <Typography variant="h1" className={classes.logo}>
          <Link to="/" className={classes.link}>
            <span>mail</span>
            <span className={classes.logoSecond}>sender</span>
          </Link>
        </Typography>
        <Typography className={classes.message}>
          <strong>Alreaady have an account?</strong>
        </Typography>
        <Button
          variant="outlined"
          className={classes.loginButton}
          component={Link}
          to="/login"
        >
          Login
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
