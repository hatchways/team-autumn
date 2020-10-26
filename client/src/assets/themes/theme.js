/* eslint-disable import/prefer-default-export */
import { createMuiTheme } from '@material-ui/core';

export const theme = createMuiTheme({
  typography: {
    fontFamily: '"Open Sans", sans-serif',
  },
  palette: {
    primary: {
      main: '#3eb485',
      dark: '#2AA897',
      light: '#4FBE75',
    },
    error: {
      main: '#d8000c',
    },
    background: {
      paper: '#fff',
      default: '#f6f6f6',
    },
    divider: '#4FBE75',
  },
  zIndex: {
    drawer: 1099,
  },
  overrides: {
    MuiDropzoneArea: {
      root: {
        left: '50%',
        transform: 'translateX(-50%)',
        marginTop: '72px',
        borderColor: '#4FBE75',
        width: '50%',
        minHeight: '125px',
      },
    },
  },
});
