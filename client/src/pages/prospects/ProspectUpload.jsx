import React, { useState } from 'react';
import { DropzoneAreaBase } from 'material-ui-dropzone';
import Papa from 'papaparse';

const EXPECTED_HEADERS = ['first_name', 'last_name', 'email'];

const ProspectUpload = () => {
  const [loading, setLoading] = useState(false);
  const [resultsText, setResultsText] = useState(false);
  const handleFileAdd = (newFile) => {
    setLoading(true);
    const { file } = newFile[0];
    const data = [];
    const emails = [];
    const errors = [];
    let repeatEmails = 0;
    Papa.parse(file, {
      delimiter: ',',
      transformHeader: (header) => header.trim().toLocaleLowerCase(),
      skipEmptyLines: true,
      header: true,
      step: (results, parser) => {
        const headers = results.meta.fields;
        const emailHeader = headers.find((header) => header.includes('email'));
        if (!emailHeader) {
          errors.push('Invalid format - email required. Aborting parse');
          parser.abort();
        } else if (emailHeader && emails.includes(results.data[emailHeader])) {
          repeatEmails += 1;
        } else {
          emails.push(results.data[emailHeader]);
          data.push(results.data);
        }
      },
      complete: () => {
        console.log(repeatEmails);
        setLoading(false);
      },
      error: (err) => {
        errors.push(err);
        setLoading(false);
      },
    });
  };

  return (
    <DropzoneAreaBase
      inputProps={{ accept: 'text/csv' }}
      dropzoneText={loading ? 'Upload in progress...' : 'Click or drag a .csv file here'}
      showFileNames
      onAdd={handleFileAdd}
    />
  );
};
export default ProspectUpload;
