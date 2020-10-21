import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Cookies from 'js-cookie';

const PrivateRoute = ({ component, ...rest }) => {
  const accessToken = Cookies.get('accessToken');

  if (accessToken) {
    return <Route {...rest} component={component} />;
  }
  return <Redirect to="/signup" />;
};

export default PrivateRoute;
