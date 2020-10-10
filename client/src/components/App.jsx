import React, { useState } from 'react';
import { MuiThemeProvider } from '@material-ui/core';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import './App.css';
import { theme } from '../themes/theme';
import LandingPage from '../pages/Landing';
import SignupPage from '../pages/Signup';
import LoginPage from '../pages/Login';
import Header from './Header';
import UserContext from './UserContext';

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  return (
    <MuiThemeProvider theme={theme}>
      <UserContext.Provider value={[isSignedIn, setIsSignedIn]}>
        <BrowserRouter>
          <Header />
          <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route path="/signup" component={SignupPage} />
            <Route path="/login" component={LoginPage} />
          </Switch>
        </BrowserRouter>
      </UserContext.Provider>
    </MuiThemeProvider>
  );
}

export default App;
