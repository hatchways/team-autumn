import React, { useState } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import FormatBoldIcon from "@material-ui/icons/FormatBold";
import FormatItalicIcon from "@material-ui/icons/FormatItalic";
import FormatUnderlinedIcon from "@material-ui/icons/FormatUnderlined";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import TextInputField from "../components/TextInputField";
import { ContentState, Editor, EditorState, RichUtils } from "draft-js";

// TODO: Make sure content for long words wraps (overflow-wrap: break-word)
const layoutStyles = {
  dialogPaper: {
    height: "80vh",
  },
  divider: {
    background: "#e0e0e0",
  },
  root: {
    height: "100%",
  },
  dialog: {
    height: "100%",
  },
  title: {
    height: "10%",
  },
  row: {
    padding: 0,
    height: "5%",
  },
  content: {
    height: "55%",
  },
  options: {
    height: "10%",
  },
  actions: {
    height: "10%",
    display: "flex",
    alignItems: "flex-end",
  },
  actionsButton: {
    padding: "0.5em 2.5em",
  },
};

const rteStyles = makeStyles((theme) => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(2),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  title: {
    // marginBottom: "1em",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
}));

const DialogTitle = (props) => {
  const classes = rteStyles();
  const { children, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.title} {...other}>
      <Typography
        variant="h5"
        style={{ display: "flex", alignItems: "center", fontWeight: "bold" }}
      >
        {children}
        <Divider
          orientation="vertical"
          flexItem
          style={{ marginLeft: "2em", background: "#e0e0e0" }}
        />
      </Typography>
      <Typography style={{ marginLeft: "2em" }}>Edit template</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
};

const ToggleTextEditorOptions = ({ onFormatChange }) => {
  const [formats, setFormats] = React.useState(() => []);

  const handleFormat = (event, newFormats) => {
    setFormats(newFormats);
    formats.map((f) => onFormatChange(f));
  };

  // TODO: make onFormatChange work for the nested icon, not just <ToggleButton />
  return (
    <ToggleButtonGroup
      value={formats}
      onChange={handleFormat}
      aria-label="text formatting"
    >
      <ToggleButton value="BOLD" aria-label="bold">
        <FormatBoldIcon />
      </ToggleButton>
      <ToggleButton value="ITALIC" aria-label="italic">
        <FormatItalicIcon />
      </ToggleButton>
      <ToggleButton value="UNDERLINE" aria-label="underlined">
        <FormatUnderlinedIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

// TODO: use export function from draft-js to save content in db - exportHTML?,
// use convertToRaw any time you exit the dialog/make the API request to save the step
// save button will save the content to step object via action dispatched by a campaign context
const RichTextEditorPopup = ({ open, onClose, title, content, classes }) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  // TODO: this is not functional yet
  // React.useEffect(() => {
  //   // createFromRaw
  //   const contentState = ContentState.createFromText(content);
  //   return () => {
  //     setEditorState(contentState);
  //   };
  // }, [content]);

  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  const onFormSubmit = (data) => {
    alert(JSON.stringify(data));
  };

  const onFormatChange = (value) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, value));
  };

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      classes={{ paper: classes.dialogPaper }}
      aria-labelledby="rich-text-editor-dialog"
      open={open}
      onClose={onClose}
    >
      <Grid container className={classes.root}>
        <Grid item xs={12}>
          <Grid container direction="column" className={classes.dialog}>
            <Grid item className={classes.title}>
              <DialogTitle id="customized-dialog-title" onClose={onClose}>
                {title}
              </DialogTitle>
            </Grid>
            <Grid item className={classes.row}>
              <Divider className={classes.divider} />
              <DialogContent>
                <TextInputField classes={classes.root} label="Type" />
              </DialogContent>
            </Grid>
            <Grid item className={classes.row} style={{ marginBottom: "2em" }}>
              <DialogContent>
                <TextInputField classes={classes.root} label="Subject" />
              </DialogContent>
            </Grid>
            <Grid item className={classes.content}>
              <DialogContent style={{ height: "100%" }}>
                <Editor
                  textAlignment="left"
                  handleKeyCommand={handleKeyCommand}
                  editorState={editorState}
                  onChange={setEditorState}
                  gutterBottom
                />
              </DialogContent>
            </Grid>
            <Grid
              item
              className={classes.options}
              style={{
                background: `#f5f5f5`,
                margin: "0 1em",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <DialogContent style={{ padding: 0, marginLeft: "1em" }}>
                <ToggleTextEditorOptions
                  onFormatChange={onFormatChange}
                  gutterBottom
                />
              </DialogContent>
            </Grid>
            <Grid item className={classes.actions}>
              <DialogActions
                style={{
                  background: `linear-gradient(90deg, #2AA897, #4FBE75)`,
                  borderRadius: "5px",
                  height: "50%",
                  margin: "0 1em 1em",
                  flexGrow: "1",
                }}
              >
                <Button
                  onClick={onClose}
                  className={classes.actionsButton}
                  style={{ color: "whitesmoke" }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  style={{ fontWeight: "bold", marginRight: "1em" }}
                  onClick={onClose}
                  className={classes.actionsButton}
                >
                  Save
                </Button>
              </DialogActions>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default withStyles(layoutStyles)(RichTextEditorPopup);
