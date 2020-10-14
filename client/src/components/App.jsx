import React, { useState } from 'react';
import { MuiThemeProvider } from '@material-ui/core';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

import './App.css';
import { theme } from '../assets/themes/theme';
import SignupPage from '../pages/Signup';
import LoginPage from '../pages/Login';
import Header from './Header';
import UserContext from './UserContext';

function App() {
  const [user, setUser] = useState({});
  return (
    <MuiThemeProvider theme={theme}>
      <UserContext.Provider value={[user, setUser]}>
        <BrowserRouter>
          <Header />
          <Switch>
            <Route exact path="/">
              {/* {Modify this when the dashboard is available} */}
              <Redirect to="/signup" />
            </Route>
            <Route path="/signup" component={SignupPage} />
            <Route path="/login" component={LoginPage} />
          </Switch>
        </BrowserRouter>
      </UserContext.Provider>
    </MuiThemeProvider>
  );
}

export default App;
