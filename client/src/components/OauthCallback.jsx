// this component will eventually be rendered in the Dashboard page

import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

// these will eventually be accessed from UserContext and passed down as props
// e.g. AlertDialog({ emailAuth, title, bodyText, buttonText }) {
//     ...
// }
const emailAuth = false;
const title = "Gmail Auth Info";
const bodyText =
  "User connected.";
const buttonText = "Skip";

export default function AlertDialog() {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(!open);
  };

  React.useEffect(() => {
    // open after 2s for smoother experience
    const timer = setTimeout(() => {
      if (!emailAuth) {
        handleOpen();
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {bodyText}
          </DialogContentText>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <button
              onClick={async () => {
                console.log("Info button clicked");
                try {
                    const response =  await fetch('/gmail_profile', {
                        method: 'GET',
                    });
                    const res = await response.json();
                    if (res.gmail_info) {
                        alert(res.gmail_info)
                    }else{
                        console.log('No url returned', res);
                    }
                } catch (err) {
                  console.log("Bad request",err);
                }
              }}>
                Click to get user info
            </button>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color={"primary"}>
            {buttonText}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}