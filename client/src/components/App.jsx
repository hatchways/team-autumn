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
import GoogleAuthPopup from './GoogleAuthPopup';
import OauthCallback from './OauthCallback';
import LoadingSpinner from './LoadingSpinner';
import UserContext from '../contexts/UserContext';
import SocketTest from './SocketTest';

const App = () => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch('/refresh', {
      method: 'POST',
    })
      .then((response) => response.json())
      .then((data) => {
        const userData = data.user_info;
        if (userData) {
          setUser({
            firstName: userData.first_name,
            lastName: userData.last_name,
            email: userData.email,
          });
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <MuiThemeProvider theme={theme}>
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
              <ProtectedRoute path="/gmail_auth" component={GoogleAuthPopup} />
              <ProtectedRoute path="/ws_test" component={SocketTest} />
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
