import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { Link } from 'react-router-dom';

import formStyles from '../themes/formStyles';
import useForm from '../hooks/useForm';

const SignupPage = () => {
  const classes = formStyles();
  const { values, updateValue, submitForm, validateFormField, errors } = useForm({
    firstName: '',
    lastName: '',
    email: '',
  });

  const onFormSubmit = (e) => {
    e.preventDefault();
    submitForm(e);
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box boxShadow={1}>
        <div className={classes.paper}>
          <Typography className={classes.title} component="h2" variant="h4">
            Create an account
          </Typography>
          <form className={classes.form} noValidate onSubmit={(e) => onFormSubmit(e)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  autoFocus
                  variant="outlined"
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  autoComplete="firstName"
                  value={values.firstName}
                  onChange={updateValue}
                  onBlur={validateFormField}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  variant="outlined"
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  autoComplete="lastName"
                  value={values.lastName}
                  onChange={updateValue}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  variant="outlined"
                  id="email"
                  name="email"
                  label="Email Address"
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
                  value={values.password}
                  onChange={updateValue}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  variant="outlined"
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  value={values.confirmPassword}
                  onChange={updateValue}
                />
              </Grid>
              <Grid item xs={12} className={classes.linkText}>
                <Typography component={Link} to="/login">
                  Already have an account?
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
                  Create
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

export default SignupPage;
