import React from 'react';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';

// import EnhancedDataTable from './EnhancedDataTable';
import { contentTemplateStyles } from '../assets/styles';

const Alert = (props) => <MuiAlert elevation={6} variant="filled" {...props} />;

/*

 ! pageTitle -> The text in the top left of the content page
 ! data -> The data to pass into the third action item
 ! actionSlots -> slots 1 & 2 are buttons, arranged opposite the text. Pass empty div if unused
 ! content -> the actual content item to display
 ! snackbarOpen -> pass in a function to manage the open state of the snackbar
 ! handleClose -> pass in a function to handle the closing of the snackbar
 ! message -> pass in some text from state to display in the snackbar
*/

const ContentTemplate = ({
  pageTitle,
  data,
  actionSlots,
  content,
  snackbarOpen,
  handleClose,
  message,
}) => {
  const classes = contentTemplateStyles();
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
            <Grid className={classes.flexEnd} item xs={8}>
              {actionSlots[1]}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {data && content}
      {/* {data.length > 0 && <EnhancedDataTable {...tableProps} />} */}
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
