import React from 'react';
import Dialog from '@material-ui/core/Dialog';
// import MuiDialogTitle from '@material-ui/core/DialogTitle';
// import Divider from '@material-ui/core/Divider';
// import IconButton from '@material-ui/core/IconButton';
// import CloseIcon from '@material-ui/icons/Close';
// import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import MuiRichTextEditor from 'mui-rte';

const RichTextEditorPopup = ({ open, onClose, onClick }) => {
  const handleClick = () => {
    // fetch(`/campaign/${campaignId}/steps_add`, {
    //   method: 'post',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     content: 'Email body',
    //     subject: 'email subject',
    //     prospect_ids: prospects,
    //   }),
    // });
    console.log({ content: 'email body', subject: 'email subject' });
  };

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      aria-labelledby="rich-text-editor-dialog"
      open={open}
      onClose={onClose}
    >
      <MuiRichTextEditor label="Step Details" inlineToolbar />
      <Button onClick={handleClick}>Add Test Step</Button>
    </Dialog>
  );
};

export default RichTextEditorPopup;
