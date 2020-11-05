import React from 'react';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import { EditorState } from 'draft-js';
import MUIRichTextEditor from 'mui-rte';

import { tableStyles } from '../assets/styles';

const ClearComponent = ({ id, onMouseDown, disabled }) => (
  <Chip id={id} onClick={onMouseDown} label="Clear" disabled={disabled} />
);

const StepEditor = ({ save }) => {
  const classes = tableStyles();
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
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
