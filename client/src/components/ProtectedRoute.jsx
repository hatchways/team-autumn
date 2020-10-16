import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';

import UserContext from '../contexts/UserContext';

const PrivateRoute = ({ component, ...rest }) => {
  const [user] = useContext(UserContext);
  return user ? <Route {...rest} component={component} /> : <Redirect to="/signup" />;
};

export default PrivateRoute;
