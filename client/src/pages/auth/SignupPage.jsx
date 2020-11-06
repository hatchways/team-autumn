import React, { useContext } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Container, Box, Grid, Typography, TextField, Button } from '@material-ui/core';
import { Redirect, useHistory } from 'react-router-dom';

import UserContext from '../../contexts/UserContext';
import { formStyles } from '../../assets/styles';

const SignupPage = () => {
  const [user, setUser] = useContext(UserContext);
  const classes = formStyles();
  const history = useHistory();

  const formikHandleSubmit = async (values, setSubmitting, setFieldError) => {
    try {
      const response = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          first_name: values.firstName,
          last_name: values.lastName,
          password: values.password,
          confirm_password: values.confirmPassword,
        }),
      });

      const res = await response.json();

      if (res.user_info) {
        const userData = res.user_info;

        setUser({
          firstName: userData.first_name,
          lastName: userData.last_name,
          email: userData.email,
        });

        setSubmitting(false);
        console.log(userData);
        let path = '/campaigns';
        if (userData.hasOwnProperty("gmail_oauthed") && !userData.gmail_oauthed){
          path = '/gmail_auth';
        }
        history.push(path);
      } else {
        // email is already in use
        setFieldError('email', 'Email is already in use');
        setSubmitting(false);
      }
    } catch (err) {
      console.log('Bad Request', err);
      setSubmitting(false);
    }
  };

  if (user) {
    return <Redirect to="/campaigns" />;
  }

  return (
    <Formik
      initialValues={{ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' }}
      onSubmit={(values, { setSubmitting, setFieldError }) => {
        formikHandleSubmit(values, setSubmitting, setFieldError);
      }}
      validationSchema={Yup.object().shape({
        firstName: Yup.string().required('This field is required'),
        lastName: Yup.string().required('This field is required'),
        email: Yup.string().email('Invalid email').required('This field is required'),
        password: Yup.string().required('This field is required'),
        confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
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
                  Sign up
                </Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        required
                        autoFocus
                        variant="outlined"
                        id="firstName"
                        name="firstName"
                        label="Your first name"
                        type="text"
                        disabled={isSubmitting}
                        error={!!errors.firstName}
                        helperText={errors.firstName}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.firstName}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        required
                        variant="outlined"
                        id="lastName"
                        name="lastName"
                        label="Your last name"
                        type="text"
                        disabled={isSubmitting}
                        error={!!errors.lastName}
                        helperText={errors.lastName}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.lastName}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        required
                        variant="outlined"
                        id="email"
                        name="email"
                        label="Your email"
                        type="email"
                        disabled={isSubmitting}
                        error={!!errors.email}
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
                        error={!!errors.password}
                        helperText={errors.password}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.password}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        required
                        variant="outlined"
                        id="confirmPassword"
                        name="confirmPassword"
                        label="Confirm password"
                        type="password"
                        disabled={isSubmitting}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.confirmPassword}
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
                        Create
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

export default SignupPage;
