import React, { useState, useEffect } from 'react';
import { MuiThemeProvider } from '@material-ui/core';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

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
import Layout from './Layout';
import UserContext from './UserContext';

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
