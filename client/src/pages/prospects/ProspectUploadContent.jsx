import React, { useContext, useState } from 'react';
import { DropzoneAreaBase } from 'material-ui-dropzone';
import { makeStyles } from '@material-ui/core/styles';
import DescriptionIcon from '@material-ui/icons/Description';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Papa from 'papaparse';
import { useHistory } from 'react-router-dom';

import UserContext from '../../contexts/UserContext';
import MessageContext from '../../contexts/MessageContext';
import BasicTable from '../../components/BasicTable';
import validateEmail from '../../util/validateEmail';
import { buttonStyles, formStyles } from '../../assets/styles';

const Alert = (props) => <MuiAlert elevation={6} variant="filled" {...props} />;

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  selectGrid: {
    justifyContent: 'space-between',
  },
}));

const ProspectUpload = () => {
  const [user] = useContext(UserContext);
  const [prospectData, setProspectData] = useState();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const classes = useStyles();
  const btnClasses = buttonStyles();
  const formClasses = formStyles();

  const [first, setFirst] = useState('');
  const [second, setSecond] = useState('');
  const [third, setThird] = useState('');

  const [message, setMessage] = useContext(MessageContext);

  const history = useHistory();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      setOpen(false);
      setMessage({ type: '', text: '' });
      return;
    }

    setOpen(false);
    setMessage({ type: '', text: '' });
  };

  const handleChange = (event) => {
    if (event.target.name === 'first-header') {
      setFirst(event.target.value);
    }
    if (event.target.name === 'second-header') {
      setSecond(event.target.value);
    }
    if (event.target.name === 'third-header') {
      setThird(event.target.value);
    }
  };

  const handleUpload = () => {
    setLoading(true);
    if (!first || !second || !third) {
      setMessage({ type: 'warning', text: 'Please assign all headers' });
      setOpen(true);
      setLoading(false);
    } else {
      setLoading(true);
      const formattedProspects = prospectData.map((d) => {
        const formattedProspect = {
          [first]: d[0],
          [second]: d[1],
          [third]: d[2],
          status: 'open',
        };
        return formattedProspect;
      });
      fetch('/upload_prospects', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formattedProspects }),
      })
        .then((response) => response.json())
        .then((r) => {
          if (r.new_prospects > 0 && r.dup_prospects === 0) {
            setMessage({
              type: 'success',
              text: `${r.new_prospects} prospects added.`,
            });
          } else if (r.new_prospects > 0 && r.dup_prospects > 0) {
            setMessage({
              type: 'success',
              text: `${r.new_prospects} prospects added. ${r.dup_prospects} prospects with duplicate emails ignored`,
            });
          } else {
            setMessage({
              type: 'warning',
              text: `No new prospects uploaded. ${r.dup_prospects} prospects with duplicate emails ignored`,
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
  };

  const handleFileAdd = (newFile) => {
    setLoading(true);
    const { file } = newFile[0];
    const emails = [];
    const data = [];
    const errors = [];
    let repeatEmails = 0;
    let currentStep = 1;
    Papa.parse(file, {
      delimiter: ',',
      skipEmptyLines: true,
      step: (results, parser) => {
        let hasEmail = false;
        let isRepeated = false;
        results.data.forEach((d) => {
          if (emails.includes(d)) {
            isRepeated = true;
          }
          if (validateEmail(d)) {
            hasEmail = true;
            emails.push(d);
          }
        });
        if (currentStep === 2) {
          if (!hasEmail) {
            setMessage({ type: 'error', text: 'No email address detected' });
            setOpen(true);
            parser.abort();
          }
        }
        if (isRepeated) {
          repeatEmails += 1;
        }
        if (hasEmail && currentStep >= 1 && !isRepeated) {
          data.push({
            ...results.data,
            owner_email: user.email,
          });
        }
        currentStep += 1;
      },
      complete: () => {
        if (data.length > 1) {
          setProspectData(data);
        }
        setLoading(false);
        if (errors.length > 0) {
          setMessage({ type: 'error', text: errors[0] });
          setOpen(true);
          setLoading(false);
        } else {
          setMessage({
            type: 'success',
            text: `${data.length} prospects found. ${repeatEmails} duplicate email addresses detected and ignored.`,
          });
          setOpen(true);
        }
      },
      error: (err) => {
        setMessage({ type: 'error', text: err });
        setOpen(true);
        setLoading(false);
      },
    });
  };

  return (
    <Container component="main" maxWidth="md">
      {!prospectData && (
        <DropzoneAreaBase
          inputProps={{ accept: 'text/csv' }}
          dropzoneText={loading ? 'Upload in progress...' : 'Click or drag a .csv file here'}
          showFileNames
          onAdd={handleFileAdd}
          Icon={DescriptionIcon}
          showAlerts={false}
        />
      )}
      {prospectData && (
        <Box boxShadow={1}>
          <div className={formClasses.uploadPaper}>
            <Typography variant="h4">Align headers with appropriate columns</Typography>
            <Grid className={classes.selectGrid} container>
              <Grid item>
                <FormControl className={classes.formControl}>
                  <Select
                    id="first-header"
                    name="first-header"
                    value={first}
                    onChange={handleChange}
                  >
                    <MenuItem value="first_name">First Name</MenuItem>
                    <MenuItem value="last_name">Last Name</MenuItem>
                    <MenuItem value="email">Email</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item>
                <FormControl className={classes.formControl}>
                  <Select
                    id="second-header"
                    name="second-header"
                    value={second}
                    onChange={handleChange}
                  >
                    <MenuItem value="first_name">First Name</MenuItem>
                    <MenuItem value="last_name">Last Name</MenuItem>
                    <MenuItem value="email">Email</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item>
                <FormControl className={classes.formControl}>
                  <Select
                    id="third-header"
                    name="third-header"
                    value={third}
                    onChange={handleChange}
                  >
                    <MenuItem value="first_name">First Name</MenuItem>
                    <MenuItem value="last_name">Last Name</MenuItem>
                    <MenuItem value="email">Email</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <BasicTable data={prospectData} />
            <Button
              className={`${btnClasses.base} ${btnClasses.action} ${btnClasses.extraWide}`}
              onClick={handleUpload}
              variant="contained"
              disabled={loading}
            >
              Upload
            </Button>
          </div>
        </Box>
      )}

      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleClose} severity={message.type}>
          {message.text}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProspectUpload;
