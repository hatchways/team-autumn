import React, { useState } from 'react';
import { MuiThemeProvider } from '@material-ui/core';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

import { theme } from '../assets/themes/theme';
import SignupPage from '../pages/Signup';
import LoginPage from '../pages/Login';
import Layout from './Layout';
import UserContext from './UserContext';

function App() {
  const [user, setUser] = useState({});
  return (
    <MuiThemeProvider theme={theme}>
      <UserContext.Provider value={[user, setUser]}>
        <BrowserRouter>
          <Layout>
            <Switch>
              <Route exact path="/">
                {/* {Modify this when the dashboard is available} */}
                <Redirect to="/signup" />
              </Route>
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
