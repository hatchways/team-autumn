import React, { useState, useEffect } from 'react';
import { MuiThemeProvider } from '@material-ui/core';
import { BrowserRouter, Switch } from 'react-router-dom';
import Cookies from 'js-cookie';

import { theme } from '../assets/themes/theme';
import SignupPage from '../pages/SignupPage';
import LoginPage from '../pages/LoginPage';
import CampaignsPage from '../pages/CampaignsPage';
import ProspectsPage from '../pages/ProspectsPage';
import TemplatesPage from '../pages/TemplatesPage';
import ReportingPage from '../pages/ReportingPage';
import ProfilePage from '../pages/ProfilePage';
import Logout from '../pages/Logout';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import Layout from './Layout';
import UserContext from './UserContext';

const App = () => {
  const [user, setUser] = useState();
  useEffect(() => {
    const refreshToken = Cookies.get('refreshToken');
    const fetchUser = async () => {
      const response = await fetch('/refresh', {
        method: 'POST',
        headers: {
          Authorization: `Bearer +${refreshToken}`,
        },
      });
      const r = await response.json();
      const userData = r.user_info;
      Cookies.remove('accessToken');
      Cookies.set('accessToken', userData.access_token);
      setUser({
        firstName: userData.first_name,
        lastName: userData.last_name,
        email: userData.email,
      });
    };
    if (refreshToken) {
      fetchUser();
    }
  }, []);

  return (
    <MuiThemeProvider theme={theme}>
      <UserContext.Provider value={[user, setUser]}>
        <BrowserRouter>
          <Layout>
            <Switch>
              <ProtectedRoute exact path="/" component={CampaignsPage} />
              <ProtectedRoute path="/campaigns" component={CampaignsPage} />
              <ProtectedRoute path="/prospects" component={ProspectsPage} />
              <ProtectedRoute path="/templates" component={TemplatesPage} />
              <ProtectedRoute path="/reporting" component={ReportingPage} />
              <ProtectedRoute path="/profile" component={ProfilePage} />
              <ProtectedRoute path="/logout" component={Logout} />
              <PublicRoute path="/signup" component={SignupPage} />
              <PublicRoute path="/login" component={LoginPage} />
            </Switch>
          </Layout>
        </BrowserRouter>
      </UserContext.Provider>
    </MuiThemeProvider>
  );
};

export default App;
