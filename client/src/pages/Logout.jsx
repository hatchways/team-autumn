import React, { useEffect, useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import UserContext from '../components/UserContext';
import { formStyles } from '../assets/styles/styles';

const Logout = () => {
  const [user, setUser] = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const classes = formStyles();
  useEffect(() => {
    const logout = async () => {
      setLoading(true);
      try {
        const response = await fetch('/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer +${user.accessToken}`,
          },
        });
        await response.json(); // later, verify logout succeeded before continuing
        setUser();
        localStorage.removeItem('user');
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    logout();
  }, [setUser, user?.accessToken]);

  if (loading) {
    return (
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress />
      </Backdrop>
    );
  }
  return <Redirect to="/signup" />;
};

export default Logout;
