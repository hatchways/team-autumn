import React, { useContext, useState } from 'react';
import { DropzoneAreaBase } from 'material-ui-dropzone';
import DescriptionIcon from '@material-ui/icons/Description';
import Typography from '@material-ui/core/Typography';
import Papa from 'papaparse';

import UserContext from '../../contexts/UserContext';

const EXPECTED_HEADERS = ['first_name', 'last_name', 'email'];

const ProspectUpload = () => {
  const [user] = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [resultsText, setResultsText] = useState(false);
  const handleFileAdd = (newFile) => {
    setLoading(true);
    const { file } = newFile[0];
    const emails = [];
    const errors = [];
    const data = [];
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
          errors.push('Invalid format - email required');
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
        console.log(prospectData);
        if (errors.length > 0) {
          setResultsText(`There was a problem: ${errors[0]}`);
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
              console.log(r);
              setResultsText(
                `File parsed. ${r.prospects_added} prospects added. ${r.dups} duplicate record(s) found and ignored. ${repeatEmails} duplicate(s) email addresses detected and ignored.`
              );
            })
            .catch((err) => console.log(err));
        }
        setLoading(false);
      },
      error: (err) => {
        errors.push(err);
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
      />
      <Typography align="center" variant="body2">
        {resultsText}
      </Typography>
    </>
  );
};
export default ProspectUpload;
