import React, { useState } from 'react';
import { DropzoneAreaBase } from 'material-ui-dropzone';
import Papa from 'papaparse';

const EXPECTED_HEADERS = ['first_name', 'last_name', 'email'];

const ProspectUpload = () => {
  const [loading, setLoading] = useState(false);
  const handleFileAdd = (newFile) => {
    setLoading(true);
    const { file } = newFile[0];
    const data = [];
    Papa.parse(file, {
      delimiter: ',',
      transformHeader: (header) => header.trim(),
      skipEmptyLines: true,
      header: true,
      step: (results, parser) => {
        const headers = results.meta.fields;
        if (!headers.includes('email')) {
          console.log('Invalid format - email required. Aborting parse');
          parser.abort();
        } else {
          data.push(results.data);
        }
      },
      complete: () => {
        console.log(data);
        setLoading(false);
      },
      error: (err) => {
        console.log(err);
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
