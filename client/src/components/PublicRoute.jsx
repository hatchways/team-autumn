import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Cookies from 'js-cookie';

const PublicRoute = ({ component, ...rest }) => {
  const accessToken = Cookies.get('accessToken');
  if (!accessToken) {
    return <Route {...rest} component={component} />;
  }
  return <Redirect to="/campaigns" />;
};

export default PublicRoute;
