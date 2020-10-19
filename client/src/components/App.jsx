import React, { useState, useEffect } from 'react';
import { MuiThemeProvider } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { theme } from '../assets/themes/theme';
import SignupPage from '../pages/auth/SignupPage';
import LoginPage from '../pages/auth/LoginPage';
import Logout from '../pages/auth/LogoutPage';
import CampaignsPage from '../pages/campaigns/CampaignsPage';
import ProspectsPage from '../pages/prospects/ProspectsPage';
import TemplatesPage from '../pages/templates/TemplatesPage';
import ReportingPage from '../pages/reporting/ReportingPage';
import ProfilePage from '../pages/profile/ProfilePage';
import ProtectedRoute from './ProtectedRoute';
import Layout from './Layout';
import AlertDialog from './Dialog';
import OauthCallback from './OauthCallback';
import UserContext from '../contexts/UserContext';

const App = () => {
  const [user, setUser] = useState();
  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch('/refresh', {
        method: 'POST',
      });
      const r = await response.json();
      const userData = r.user_info;
      if (userData) {
        setUser({
          firstName: userData.first_name,
          lastName: userData.last_name,
          email: userData.email,
        });
      }
    };
    fetchUser();
  }, []);

  return (
    <MuiThemeProvider theme={theme}>
      {console.log(theme)}
      <CssBaseline />
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
              <ProtectedRoute path="/gmail_auth" component={AlertDialog} />
              <Route path="/gmail_oauth_callback" component={OauthCallback} />
              <Route path="/signup" component={SignupPage} />
              <Route path="/login" component={LoginPage} />
            </Switch>
          </Layout>
        </BrowserRouter>
      </UserContext.Provider>
    </MuiThemeProvider>
  );
};

export default App;
