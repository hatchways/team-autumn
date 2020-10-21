import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';

import UserContext from './UserContext';

const PublicRoute = ({ component, ...rest }) => {
  const [user] = useContext(UserContext);
  // const userData = localStorage.getItem('user');
  if (!user) {
    return <Route {...rest} component={component} />;
  }
  return <Redirect to="/campaigns" />;
};

export default PublicRoute;
