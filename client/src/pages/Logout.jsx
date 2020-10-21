import React, { useEffect, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import UserContext from '../components/UserContext';

const Logout = () => {
  const [user, setUser] = useContext(UserContext);
  useEffect(() => {
    // TODO : send logout request to server
    const logout = async () => {
      try {
        const response = await fetch('/logout', {
          method: 'POST',
          // headers: {
          //   Authorization: `Bearer +${user.accessToken}`,
          // },
        });
        const res = await response.json();
        console.log(res);
        setUser();
        localStorage.removeItem('user');
      } catch (err) {
        console.log(err);
      }
    };
    logout();
  }, [setUser, user.accessToken]);

  return <Redirect to="signup" />;
};

export default Logout;
