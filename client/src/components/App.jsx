import React, { useState, useEffect } from 'react';
import { MuiThemeProvider } from '@material-ui/core';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import CssBaseline from '@material-ui/core/CssBaseline';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { theme } from '../assets/themes/theme';
import { formStyles } from '../assets/styles';
import SignupPage from '../pages/auth/SignupPage';
import LoginPage from '../pages/auth/LoginPage';
import Logout from '../pages/auth/LogoutPage';
import CampaignPage from '../pages/campaign/CampaignPage';
import ProspectsPage from '../pages/prospects/ProspectsPage';
import ProspectUpload from '../pages/prospects/ProspectUpload';
import TemplatesPage from '../pages/templates/TemplatesPage';
import ReportingPage from '../pages/reporting/ReportingPage';
import ProfilePage from '../pages/profile/ProfilePage';
import ProtectedRoute from './ProtectedRoute';
import Layout from './Layout';
import UserContext from '../contexts/UserContext';
import AlertDialog from './Dialog';
import OauthCallback from './OauthCallback';

const App = () => {
  const classes = formStyles();

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
    return (
      <Backdrop className={classes.backdrop} open>
        <CircularProgress />
      </Backdrop>
    );
  }

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <UserContext.Provider value={[user, setUser]}>
        <BrowserRouter>
          <Layout>
            <Switch>
              <ProtectedRoute exact path="/" component={CampaignPage} />
              <ProtectedRoute path="/campaigns" component={CampaignPage} />
              <ProtectedRoute path="/prospects" component={ProspectsPage} />
              <ProtectedRoute path="/prospect_upload" component={ProspectUpload} />
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
