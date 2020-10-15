import React, { useEffect, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import UserContext from '../components/UserContext';

const Logout = () => {
  const [user, setUser] = useContext(UserContext);
  useEffect(() => {
    setUser(false);
  }, [setUser]);

  return <Redirect to="signup" />;
};

export default Logout;
