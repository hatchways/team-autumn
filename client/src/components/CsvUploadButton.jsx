import React, { useContext, useState } from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { CSVReader } from 'react-papaparse';

import buttonStyles from '../assets/styles/buttonStyles';
import UserContext from '../contexts/UserContext';

const buttonRef = React.createRef();

const CsvUploadButton = () => {
  const [user] = useContext(UserContext);
  const classes = buttonStyles();
  const [loading, setLoading] = useState(false);
  const handleOpenDialog = (e) => {
    // Note that the ref is set async, so it might be null at some point
    if (buttonRef.current) {
      buttonRef.current.open(e);
    }
  };

  const handleOnFileLoad = (data) => {
    const prospectData = Object.fromEntries(
      Object.entries(
        data.slice(1).map((prospect) => ({
          owner_email: user.email,
          first_name: prospect.data[0],
          last_name: prospect.data[1],
          email: prospect.data[2],
        }))
      )
    );
    setLoading(true);
    console.log('---------------------------');

    fetch('/upload_prospects', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(prospectData),
    })
      .then((response) => console.log(response))
      .then((r) => console.log(r))
      .catch((err) => console.log(err));
    console.log(prospectData);
    console.log('---------------------------');
    setLoading(false);
  };

  const handleOnError = (err, file, inputElem, reason) => {
    console.log(err, file, inputElem, reason);
    setLoading(false);
  };

  return (
    <CSVReader
      ref={buttonRef}
      onFileLoad={handleOnFileLoad}
      onError={handleOnError}
      noClick
      noDrag
      config={{
        delimiter: ',',
        worker: true,
        skipEmptyLines: true,
      }}
    >
      {() => (
        <Button
          className={`${classes.base} ${classes.action}`}
          type="button"
          onClick={handleOpenDialog}
        >
          {loading
            ? `Upload Prospects by File ${(<CircularProgress />)}`
            : 'Upload Prospects by File'}
        </Button>
      )}
    </CSVReader>
  );
};

export default CsvUploadButton;
