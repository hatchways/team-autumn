import React, { useState } from 'react';
import { MuiThemeProvider } from '@material-ui/core';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { theme } from '../assets/themes/theme';
import SignupPage from '../pages/Signup';
import LoginPage from '../pages/Login';
import CampaignsPage from '../pages/CampaignsPage';
import ProspectsPage from '../pages/ProspectsPage';
import TemplatesPage from '../pages/TemplatesPage';
import ReportingPage from '../pages/ReportingPage';
import ProfilePage from '../pages/ProfilePage';
import Logout from '../pages/Logout';
import ProtectedRoute from './ProtectedRoute';
import Layout from './Layout';
import AlertDialog from './Dialog';
import UserContext from './UserContext';
import OauthCallback from "./OauthCallback";
function App() {
  const [user, setUser] = useState(false);
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
}

export default App;
