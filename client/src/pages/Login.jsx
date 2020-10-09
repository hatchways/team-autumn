import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles((theme) => ({
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
  submit: {
    margin: theme.spacing(3, 0, 2),
    background: 'linear-gradient(90deg, #2AA897, #4FBE75)',
    height: '3rem',
    fontWeight: 600,
  },
}));

const LoginPage = () => {
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="sm">
      <Box boxShadow={1}>
        <div className={classes.paper}>
          <Typography className={classes.title} component="h2" variant="h4">
            Login to your account
          </Typography>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Your email"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
              </Grid>
            </Grid>
            <Grid item container xs={12}>
              <Grid item xs={4} />
              <Grid item xs={4}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  color="primary"
                  className={classes.submit}
                >
                  Login
                </Button>
              </Grid>
              <Grid item xs={4} />
            </Grid>
          </form>
        </div>
      </Box>
    </Container>
  );
};

export default LoginPage;
