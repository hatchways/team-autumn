import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';

import UserContext from '../contexts/UserContext';

const PrivateRoute = ({ component, ...rest }) => {
  const [user] = useContext(UserContext);
  if (user) {
    return <Route {...rest} component={component} />;
  }
  return <Redirect to="/signup" />;
};

export default PrivateRoute;
