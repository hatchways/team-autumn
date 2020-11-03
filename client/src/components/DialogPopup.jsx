import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const DialogPopup = ({
  actionItem,
  title,
  bodyText,
  buttonText,
  ariaLabeledBy,
  ariaDescribedBy,
  open,
  setOpen,
}) => {
  // const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(!open);
  };

  return (
    <Dialog
      maxWidth="sm"
      fullWidth
      open={open}
      onClose={handleClose}
      aria-labelledby={ariaLabeledBy}
      aria-describedby={ariaDescribedBy}
    >
      <DialogTitle id={`${title}-dialog`}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id={`${title}-dialog-description`}>{bodyText}</DialogContentText>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {actionItem}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          {buttonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogPopup;
