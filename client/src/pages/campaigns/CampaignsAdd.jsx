import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Grid, TextField, Button } from '@material-ui/core';

import { formStyles, buttonStyles } from '../../assets/styles';

const CampaignsAdd = ({ setOpen }) => {
  const classes = formStyles();
  const buttonClasses = buttonStyles();

  const formikHandleSubmit = (values, setSubmitting) => {
    console.log('submitted');
    fetch('/user/campaigns_append', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: values.campaignName,
        // potentially add variables later
      }),
    })
      .then((response) => response.json())
      .then(() => {
        setSubmitting(false);
        setOpen(false);
      })
      .catch(() => {
        setSubmitting(false);
      });
  };

  return (
    <Formik
      initialValues={{ campaignName: '' }}
      onSubmit={(values, { setSubmitting }) => {
        formikHandleSubmit(values, setSubmitting);
      }}
      validationSchema={Yup.object().shape({
        campaignName: Yup.string().required('This field is required'),
      })}
      validateOnBlur={false}
      validateOnChange={false}
    >
      {(props) => {
        const { values, errors, isSubmitting, handleChange, handleBlur, handleSubmit } = props;

        return (
          <form className={classes.form} onSubmit={handleSubmit}>
            <Grid diretion="column" className={classes.centered} container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  autoFocus
                  variant="outlined"
                  id="campaignName"
                  name="campaignName"
                  label="Campaign Name"
                  type="text"
                  disabled={isSubmitting}
                  error={!!errors.campaignName}
                  helperText={errors.campaignName}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.campaignName}
                />
              </Grid>
              <Grid className={classes.centered} item xs={6}>
                <Button
                  fullWidth
                  disabled={isSubmitting}
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={`${buttonClasses.base} ${buttonClasses.action} ${buttonClasses.extraWide}`}
                >
                  Create Campaign
                </Button>
              </Grid>
            </Grid>
          </form>
        );
      }}
    </Formik>
  );
};

export default CampaignsAdd;
