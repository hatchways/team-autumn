import React, { useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';

const ErrorSnackbar = ({ error }) => {
  const [state, setState] = useState({
    open: false,
    vertical: 'bottom',
    horizontal: 'center',
  });

  const { vertical, horizontal, open } = state;

  // const handleClick = (newState) => () => {
  //   setState({ open: true, ...newState });
  // };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={handleClose}
        message={`Error: ${error.message}`}
        key={error.field + error.message}
      />
    </>
  );
};

export default ErrorSnackbar;
