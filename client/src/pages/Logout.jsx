import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Cookies from 'js-cookie';

import { formStyles } from '../assets/styles/styles';

const Logout = () => {
  const [loading, setLoading] = useState(true);
  const classes = formStyles();
  useEffect(() => {
    const logout = async () => {
      const accessToken = Cookies.get('accessToken');
      try {
        const response = await fetch('/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer +${accessToken}`,
          },
        });
        await response.json(); // later, verify logout succeeded before continuing
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    logout();
  }, []);

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
