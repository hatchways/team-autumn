import React, { useEffect, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import UserContext from '../../contexts/UserContext';

const Logout = () => {
  const [setUser] = useContext(UserContext);
  useEffect(() => {
    setUser(false);
  }, [setUser]);

  return <Redirect to="signup" />;
};

export default Logout;
