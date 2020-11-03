import React from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import { formStyles } from '../assets/styles';

const LoadingSpinner = () => {
  const classes = formStyles();
  return (
    <Backdrop className={classes.backdrop} open>
      <CircularProgress />
    </Backdrop>
  );
};

export default LoadingSpinner;
