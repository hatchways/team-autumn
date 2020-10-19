import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import formStyles from '../assets/styles/formStyles';

const SignupPage = () => {
  const classes = formStyles();

  const { register, errors, handleSubmit, watch } = useForm({ mode: 'onBlur' });

  const onFormSubmit = (data) => {
    alert(JSON.stringify(data));
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box boxShadow={1}>
        <div className={classes.paper}>
          <Typography className={classes.title} component="h2" variant="h4">
            Create an account
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit((data) => onFormSubmit(data))}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  autoFocus
                  color="primary"
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  variant="outlined"
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  autoComplete="firstName"
                  inputRef={register({
                    required: 'First name is required',
                    minLength: {
                      value: 2,
                      message: 'First name must be at least two characters long',
                    },
                    pattern: {
                      value: /^[A-Za-z]+$/i,
                      message: 'Only letters allowed in first name',
                    },
                  })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  color="primary"
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                  variant="outlined"
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  autoComplete="lastName"
                  inputRef={register({
                    required: 'Last name is required',
                    minLength: {
                      value: 2,
                      message: 'Last name must be at least two characters long',
                    },
                    pattern: {
                      value: /^[A-Za-z]+$/i,
                      message: 'Only letters allowed in last name',
                    },
                  })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  color="primary"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  variant="outlined"
                  id="email"
                  name="email"
                  label="Email Address"
                  autoComplete="email"
                  inputRef={register({
                    required: 'Email address is required',
                    pattern: {
                      value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                      message: 'Valid email format: xxxx@yyy.zzz',
                    },
                  })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  color="primary"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  variant="outlined"
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  inputRef={register({
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least six characters' },
                  })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  color="primary"
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  variant="outlined"
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  inputRef={register({
                    validate: (val) => val === watch('password') || 'Passwords must match',
                  })}
                />
              </Grid>
              <Grid item xs={12} className={classes.linkText}>
                <Typography component={Link} to="/login">
                  Already have an account?
                </Typography>
              </Grid>
            </Grid>
            <Grid item container className={classes.centered} xs={12}>
              <Grid item xs={4}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  color="primary"
                  className={classes.action}
                >
                  Create
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      </Box>
    </Container>
  );
};

export default SignupPage;