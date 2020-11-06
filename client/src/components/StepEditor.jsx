import React, { useContext, useState } from 'react';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { EditorState } from 'draft-js';
import MUIRichTextEditor from 'mui-rte';

import { tableStyles } from '../assets/styles';

const ClearComponent = ({ id, onMouseDown, disabled }) => (
  <Chip id={id} onClick={onMouseDown} label="Clear" disabled={disabled} />
);

const StepEditor = ({ setVariables, setMessage }) => {
  const [subject, setSubject] = useState('');

  const save = (editorContents) => {
    const parsedContents = JSON.parse(editorContents);
    const bodyString = parsedContents.blocks
      .map((block) => {
        if (block.text === '') {
          return block.text.replace('', /n/);
        }
        return block.text;
      })
      .join('');
    setVariables({ step: { body: bodyString, subject } });
    setMessage({ type: 'info', text: 'Email Saved!' });
  };

  const classes = tableStyles();
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TextField
          fullWidth
          required
          variant="outlined"
          id="subject"
          name="subject"
          label="Step Subject"
          type="text"
          onChange={(e) => setSubject(e.target.value)}
          value={subject}
        />
        <MUIRichTextEditor
          label="Type something here..."
          onSave={save}
          controls={['clear-callback', 'save']}
          customControls={[
            {
              name: 'clear-callback',
              component: ClearComponent,
              type: 'callback',
              onClick: () => EditorState.createEmpty(),
            },
          ]}
        />
      </Paper>
    </div>
  );
};

export default StepEditor;
