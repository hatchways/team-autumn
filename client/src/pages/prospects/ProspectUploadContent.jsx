import React, { useContext, useState } from 'react';
import { DropzoneAreaBase } from 'material-ui-dropzone';
import DescriptionIcon from '@material-ui/icons/Description';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import ToggleButton from '@material-ui/lab/ToggleButton';
import Papa from 'papaparse';
import { useHistory } from 'react-router-dom';

import UserContext from '../../contexts/UserContext';
import ProspectUploadContext from '../../contexts/ProspectUploadContext';
import { buttonStyles } from '../../assets/styles';

/*
  Todo: add dialog box to confirm headers to match database
  
  const EXPECTED_HEADERS = ['first_name', 'last_name', 'email'];
*/

const Alert = (props) => <MuiAlert elevation={6} variant="filled" {...props} />;

const ProspectUpload = () => {
  const [user] = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [, setSnackbarOpen] = useState(false);
  const [selected, setSelected] = useState(true);
  const [message, setMessage] = useContext(ProspectUploadContext);

  const classes = buttonStyles();
  const history = useHistory();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpen(false);
    setMessage('');
  };

  const handleFileAdd = (newFile) => {
    setLoading(true);
    const { file } = newFile[0];
    const emails = [];
    const data = [];
    const errors = [];
    let repeatEmails = 0;
    Papa.parse(file, {
      delimiter: ',',
      transformHeader: (header) => header.trim().toLocaleLowerCase(),
      skipEmptyLines: true,
      header: selected,
      step: (results, parser) => {
        const headers = results.meta.fields;
        const emailHeader = headers.find((header) => header.includes('email'));
        if (!emailHeader) {
          errors.push('Invalid format - email header required');
          setMessage({ type: 'error', text: 'Invalid format - email required' });
          parser.abort();
        } else if (emailHeader && emails.includes(results.data[emailHeader])) {
          repeatEmails += 1;
        } else {
          emails.push(results.data[emailHeader]);
          data.push({
            ...results.data,
            email: results.data[emailHeader],
            owner_email: user.email,
          });
        }
      },
      complete: () => {
        const prospectData = { ...data };
        if (errors.length > 0) {
          setMessage({ type: 'error', text: errors[0] });
          setLoading(false);
        } else {
          fetch('/upload_prospects', {
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(prospectData),
          })
            .then((response) => response.json())
            .then((r) => {
              if (r.prospects_added === 0) {
                setMessage({
                  type: 'warning',
                  text: `${r.prospects_added} prospects added. ${r.dups} duplicate record(s) found and ignored. ${repeatEmails} duplicate(s) email addresses detected and ignored.`,
                });
              } else {
                setMessage({
                  type: 'success',
                  text: `${r.prospects_added} prospects added. ${r.dups} duplicate record(s) found and ignored. ${repeatEmails} duplicate(s) email addresses detected and ignored.`,
                });
              }
              setLoading(false);
            })
            .then(() => history.push('/prospects'))
            .catch((err) => {
              setLoading(false);
              setMessage({ type: 'error', text: err });
            });
        }
      },
      error: (err) => {
        setMessage({ type: 'error', text: err });
        setLoading(false);
      },
    });
  };

  return (
    <>
      <DropzoneAreaBase
        inputProps={{ accept: 'text/csv' }}
        dropzoneText={loading ? 'Upload in progress...' : 'Click or drag a .csv file here'}
        showFileNames
        onAdd={handleFileAdd}
        Icon={DescriptionIcon}
        showAlerts={false}
      />
      <ToggleButton
        className={classes.base}
        value={selected}
        selected={selected}
        onChange={() => setSelected(!selected)}
        aria-label="headers"
      >
        Enable Headers in CSV
      </ToggleButton>
      <Snackbar
        open={message?.text}
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
export default ProspectUpload;
