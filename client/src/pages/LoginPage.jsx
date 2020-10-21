import React, { useContext } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Container, Box, Grid, Typography, TextField, Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

import UserContext from '../components/UserContext';
import { formStyles } from '../assets/styles/styles';

const LoginPage = () => {
  const [, setUser] = useContext(UserContext);
  const classes = formStyles();
  const history = useHistory;

  const formikHandleSubmit = async (values, setSubmitting) => {
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const res = await response.json();
      const userData = res.user_info;

      localStorage.setItem('user', JSON.stringify(userData));

      setUser({
        firstName: userData.first_name,
        lastName: userData.last_name,
        email: userData.email,
      });
      setSubmitting(false);
      history.push('/campaigns');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      onSubmit={(values, { setSubmitting }) => {
        formikHandleSubmit(values, setSubmitting);
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string().email('Invalid email').required('Email is required'),
        password: Yup.string().required('Password is required'),
      })}
      validateOnBlur={false}
      validateOnChange={false}
    >
      {(props) => {
        const { values, errors, isSubmitting, handleChange, handleBlur, handleSubmit } = props;

        return (
          <Container component="main" maxWidth="sm">
            <Box boxShadow={1}>
              <div className={classes.paper}>
                <Typography className={classes.title} component="h2" variant="h4">
                  Login to your account
                </Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
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
                        type="email"
                        disabled={isSubmitting}
                        error={errors.email}
                        helperText={errors.email}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.email}
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
                        disabled={isSubmitting}
                        error={errors.password}
                        helperText={errors.password}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.password}
                      />
                    </Grid>
                  </Grid>
                  <Grid className={classes.centered} item container xs={12}>
                    <Grid item xs={4}>
                      <Button
                        fullWidth
                        disabled={isSubmitting}
                        type="submit"
                        variant="contained"
                        color="primary"
                        className={classes.action}
                      >
                        Login
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </div>
            </Box>
          </Container>
        );
      }}
    </Formik>
  );
};

export default LoginPage;
