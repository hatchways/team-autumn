import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { CSVReader } from 'react-papaparse';

import buttonStyles from '../assets/styles/buttonStyles';

const buttonRef = React.createRef();

const CsvUploadButton = () => {
  const classes = buttonStyles();
  const [loading, setLoading] = useState(false);
  const handleOpenDialog = (e) => {
    // Note that the ref is set async, so it might be null at some point
    if (buttonRef.current) {
      buttonRef.current.open(e);
    }
  };

  const handleOnFileLoad = (data) => {
    setLoading(true);
    console.log('---------------------------');
    console.log(data);
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
      configOptions={{
        delimiter: ',',
        header: true,
        worker: true,
        skipEmptyLines: true,
        // step: (results, parser) => {
        //   console.log(`Row data: ${results.data}`);
        //   console.log(`Row errors: ${results.errors}`);
        // },
        // complete: (results, file) => {
        //   console.log(`Parsing complete. Here are the results: ${results}`);
        // },
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
