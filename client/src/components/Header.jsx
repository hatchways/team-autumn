import React, { useState, useContext } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  makeStyles,
  Avatar,
  Menu,
  MenuItem,
} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { Link, useLocation } from 'react-router-dom';

import UserContext from './UserContext';
import portrait from '../assets/images/portrait.png';
import TabNav from './TabNav';

const useStyles = makeStyles((theme) => ({
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
  },
  dropdownIcon: {
    color: '#9e9e9e',
  },
  tabLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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

const LoggedInNav = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const classes = useStyles();
  const [user] = useContext(UserContext);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const renderAvatar = () =>
    user.profilePicture ? (
      <Avatar alt={`${user.firstName} ${user.lastName}`} src={portrait} />
    ) : (
      <Avatar>{`${user.firstName[0]}${user.lastName[0]}`}</Avatar>
    );
  // Todo: Fix positioning of profile menu
  return (
    <>
      <TabNav />
      {renderAvatar()}
      <Button
        className={classes.profileButton}
        endIcon={<ArrowDropDownIcon className={classes.dropdownIcon} />}
        onClick={handleClick}
      >
        {`${user.firstName} ${user.lastName}`}
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        keepMounted
        open={!!anchorEl}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu>
    </>
  );
};

const Header = () => {
  const [user] = useContext(UserContext);
  const location = useLocation();

  const classes = useStyles();

  return (
    <>
      <AppBar className={classes.root} position="fixed">
        <Toolbar>
          <Typography variant="h1" className={classes.logo}>
            <Link to="/" className={classes.link}>
              <span>mail</span>
              <span className={classes.logoSecond}>sender</span>
            </Link>
          </Typography>
          {!user && location.pathname.includes('signup') && <Login />}
          {!user && location.pathname.includes('login') && <Signup />}
          {user && (
            <>
              <LoggedInNav />
            </>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
