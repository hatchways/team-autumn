import React, { useEffect, useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';

import UserContext from '../components/UserContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Logout = () => {
  const [user, setUser] = useContext(UserContext);
  const [loading, setLoading] = useState(false);
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
    return <LoadingSpinner open={loading} />;
  }
  return <Redirect to="/signup" />;
};

export default Logout;
