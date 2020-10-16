import React, { useState, useContext } from 'react';
import { AppBar, Toolbar, Button, Typography, Avatar, Menu, MenuItem } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { Link, useLocation } from 'react-router-dom';

import UserContext from '../contexts/UserContext';
import portrait from '../assets/images/portrait.png';
import TabNav from './TabNav';
import headerStyles from '../assets/styles/headerStyles';

const tabs = [
  {
    label: 'Campaigns',
    to: '/campaigns',
    id: 'nav-tab-campaigns',
  },
  {
    label: 'Prospects',
    to: '/prospects',
    id: 'nav-tab-prospects',
  },
  {
    label: 'Templates',
    to: '/templates',
    id: 'nav-tab-templates',
  },
  {
    label: 'Reporting',
    to: '/reporting',
    id: 'nav-tab-reporting',
  },
];

const Login = () => {
  const classes = headerStyles();
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
  const classes = headerStyles();
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

  const classes = headerStyles();
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
  return (
    <>
      <TabNav tabs={tabs} />
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
        <MenuItem onClick={handleClose}>
          <Link className={classes.tabLink} to="/profile">
            Profile
          </Link>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Link className={classes.tabLink} to="/logout">
            Logout
          </Link>
        </MenuItem>
      </Menu>
    </>
  );
};

const Header = () => {
  const [user] = useContext(UserContext);
  const location = useLocation();

  const classes = headerStyles();

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
          {user && <LoggedInNav />}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
