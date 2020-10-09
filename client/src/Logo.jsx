import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  logo: {
    color: '#4FBE75',
  },
}));

const Logo = () => {
  const classes = useStyles();
  return (
    <Typography variant="h2">
      <span>mail</span>
      <span className={classes.logo}>sender</span>
    </Typography>
  );
};

export default Logo;
