import React, { useContext, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import { formStyles } from '../../assets/styles';
import UserContext from '../../contexts/UserContext';

const Logout = () => {
  const [, setUser] = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const classes = formStyles();
  useEffect(() => {
    setLoading(true);
    fetch('/logout', { method: 'POST' })
      .then((response) => response.json())
      .then(() => {
        setUser();
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [setUser]);

  if (loading) {
    return (
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress />
      </Backdrop>
    );
  }
  return <Redirect to="/login" />;
};

export default Logout;
