// import React from 'react';
// import Dialog from '@material-ui/core/Dialog';
// import MuiDialogTitle from '@material-ui/core/DialogTitle';
// import Divider from '@material-ui/core/Divider';
// import IconButton from '@material-ui/core/IconButton';
// import CloseIcon from '@material-ui/icons/Close';
// import Typography from '@material-ui/core/Typography';
// // import MuiRichTextEditor from 'mui-rte';
// import { Button } from '@material-ui/core';

// const DialogTitle = (props) => {
//   const classes = rteStyles();
//   const { children, onClose, ...other } = props;
//   return (
//     <MuiDialogTitle disableTypography className={classes.title} {...other}>
//       <Typography
//         variant="h5"
//         style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}
//       >
//         {children}
//         <Divider
//           orientation="vertical"
//           flexItem
//           style={{ marginLeft: '2em', background: '#e0e0e0' }}
//         />
//       </Typography>
//       <Typography component="body2">Step Details</Typography>
//       {onClose ? (
//         <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
//           <CloseIcon />
//         </IconButton>
//       ) : null}
//     </MuiDialogTitle>
//   );
// };

// const RichTextEditorPopup = ({ open, onClose, classes, campaignId, prospects }) => {
//   const handleClick = () => {
//     fetch(`/campaign/${campaignId}/steps_add`, {
//       method: 'post',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         content: 'Email body',
//         subject: 'email subject',
//         prospect_ids: prospects,
//       }),
//     });
//   };

//   return (
//     <Dialog
//       fullWidth
//       maxWidth="md"
//       classes={{ paper: classes.dialogPaper }}
//       aria-labelledby="rich-text-editor-dialog"
//       open={open}
//       onClose={onClose}
//     >
//       <MuiRichTextEditor label="Step Details" inlineToolbar />
//       <Button onClick={handleClick}>Add Test Step</Button>
//     </Dialog>
//   );
// };

// // export default withStyles(layoutStyles)(RichTextEditorPopup);
