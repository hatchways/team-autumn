import React, { useEffect, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import UserContext from '../components/UserContext';

const Logout = () => {
  const [, setUser] = useContext(UserContext);
  useEffect(() => {
    setUser();
    localStorage.removeItem('user');
  }, [setUser]);

  return <Redirect to="signup" />;
};

export default Logout;
