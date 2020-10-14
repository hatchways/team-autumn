/* eslint-disable import/prefer-default-export */
import { createMuiTheme } from '@material-ui/core';

export const theme = createMuiTheme({
  typography: {
    fontFamily: '"Open Sans", sans-serif',
  },
  palette: {
    primary: {
      main: '#2AA897',
    },
    secondary: {
      main: '#4FBE75',
    },
    error: {
      main: '#d8000c',
    },
    background: {
      paper: '#fff',
      default: '#f6f6f6',
    },
  },
});
