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
    MUIRichTextEditor: {
      root: {
        backgroundColor: '#ebebeb',
      },
      container: {
        display: 'flex',
        flexDirection: 'column-reverse',
      },
      editor: {
        backgroundColor: '#ebebeb',
        padding: '20px',
        height: '200px',
        maxHeight: '200px',
        overflow: 'auto',
      },
      toolbar: {
        borderTop: '1px solid gray',
        backgroundColor: '#ebebeb',
      },
      placeHolder: {
        backgroundColor: '#ebebeb',
        paddingLeft: 20,
        width: 'inherit',
        position: 'absolute',
        top: '20px',
      },
      anchorLink: {
        color: '#333333',
        textDecoration: 'underline',
      },
    },
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
    MuiTableContainer: {
      root: {
        width: '100%',
      },
    },
    MuiTableSortLabel: {
      root: {
        color: 'white',
        fontWeight: 600,
        '&.MuiTableSortLabel-active': {
          color: 'white',
        },
      },
      active: {
        color: 'white',
      },
    },
  },
});
