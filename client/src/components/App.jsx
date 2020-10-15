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
import ProtectedRoute from './ProtectedRoute';
import Layout from './Layout';
import UserContext from './UserContext';

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
