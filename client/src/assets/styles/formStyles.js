import { makeStyles } from '@material-ui/core';

const formStyles = makeStyles((theme) => ({
  root: {
    justifyContent: 'center',
  },
  title: {
    fontWeight: 600,
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: '4rem 0',
    borderRadius: '5px',
  },
  form: {
    width: '75%', // Fix IE 11 issue.
    marginTop: theme.spacing(8),
  },
  action: {
    margin: theme.spacing(3, 0, 2),
    background: 'linear-gradient(90deg, #2AA897, #4FBE75)',
    height: '3rem',
    fontWeight: 600,
    textTransform: 'none',
    borderRadius: '5px',
  },
  linkText: {
    textAlign: 'right',
  },
}));

export default formStyles;
