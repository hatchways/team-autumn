import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { useForm } from 'react-hook-form';

import formStyles from '../../assets/styles/formStyles';
import buttonStyles from '../../assets/styles/buttonStyles';

const LoginPage = () => {
  const formClasses = formStyles();
  const buttonClasses = buttonStyles();

  const { register, errors, handleSubmit } = useForm();

  const onFormSubmit = (data) => {
    alert(JSON.stringify(data));
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box boxShadow={1}>
        <div className={formClasses.paper}>
          <Typography className={formClasses.title} component="h2" variant="h4">
            Login to your account
          </Typography>
          <form className={formClasses.form} onSubmit={handleSubmit((data) => onFormSubmit(data))}>
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
                  inputRef={register}
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
                  inputRef={register}
                />
              </Grid>
            </Grid>
            <Grid item container xs={12}>
              <Grid item xs={4}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  color="primary"
                  className={`${buttonClasses.action} ${buttonClasses.base}`}
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
};

export default LoginPage;
