import React from 'react';
import { makeStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';

import EnhancedDataTable from './EnhancedDataTable';

const useStyles = makeStyles(() => ({
  mainGrid: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faded: {
    color: '#9e9e9e',
  },
  buttonRight: {
    justifyContent: 'flex-end',
  },
}));

const Alert = (props) => <MuiAlert elevation={6} variant="filled" {...props} />;

const ContentTemplate = ({
  pageTitle,
  data,
  actionSlots,
  tableProps,
  snackbarOpen,
  handleClose,
  message,
}) => {
  const classes = useStyles();
  return (
    <>
      <Grid className={classes.mainGrid} container>
        <Typography component="h3" variant="h6">
          {pageTitle}
        </Typography>
        <Grid className={classes.buttonGrid} item container xs={6}>
          <Grid item xs={4}>
            {actionSlots[0]}
          </Grid>
          <Grid className={classes.buttonRight} container item xs={8}>
            <Grid item xs={8}>
              {actionSlots[1]}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {data.length > 0 && <EnhancedDataTable {...tableProps} />}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleClose} severity={message.type}>
          {message.text}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ContentTemplate;
