import React, { useContext } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import { Link } from 'react-router-dom';
import formStyles from '../themes/formStyles';
import useForm from '../hooks/useForm';
import UserContext from '../components/UserContext';

const LoginPage = () => {
  const classes = formStyles();
  const { values, updateValue } = useForm({
    email: '',
  });
  const [isSignedIn, setIsSignedIn] = useContext(UserContext);

  const onFormSubmit = (e) => {
    e.preventDefault();
    setIsSignedIn(true);
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box boxShadow={1}>
        <div className={classes.paper}>
          <Typography className={classes.title} component="h2" variant="h4">
            Login to your account
          </Typography>
          <form className={classes.form} noValidate onSubmit={onFormSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  autoFocus
                  variant="outlined"
                  id="email"
                  name="email"
                  label="Your email"
                  autoComplete="email"
                  value={values.email}
                  onChange={updateValue}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  variant="outlined"
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  value={values.password}
                  onChange={updateValue}
                />
              </Grid>
              <Grid item xs={12} className={classes.linkText}>
                <Typography component={Link} to="/signup">
                  Need an account?
                </Typography>
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
