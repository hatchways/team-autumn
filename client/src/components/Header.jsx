import React, { useContext } from 'react';
import { AppBar, Toolbar, Button, Typography, makeStyles } from '@material-ui/core';
import { Link, useLocation } from 'react-router-dom';

import UserContext from './UserContext';

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

const Login = () => {
  const classes = useStyles();
  return (
    <>
      <Typography className={classes.message}>
        <strong>Already have an account?</strong>
      </Typography>
      <Button variant="outlined" className={classes.loginButton} component={Link} to="/login">
        Login
      </Button>
    </>
  );
};

const Signup = () => {
  const classes = useStyles();
  return (
    <>
      <Typography className={classes.message}>
        <strong>Need an account?</strong>
      </Typography>
      <Button variant="outlined" className={classes.loginButton} component={Link} to="/signup">
        Create
      </Button>
    </>
  );
};

const Avatar = () => <p>Avatar goes here</p>;

const Header = () => {
  const location = useLocation();
  const [user] = useContext(UserContext);
  const classes = useStyles();

  const userPresent = Object.keys(user).length > 0;

  return (
    <AppBar className={classes.root} position="fixed">
      <Toolbar>
        <Typography variant="h1" className={classes.logo}>
          <Link to="/" className={classes.link}>
            <span>mail</span>
            <span className={classes.logoSecond}>sender</span>
          </Link>
        </Typography>
        {!userPresent && location.pathname.includes('signup') && <Login />}
        {!userPresent && location.pathname.includes('login') && <Signup />}
        {userPresent && <Avatar />}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
