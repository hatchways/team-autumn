import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import MuiListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import MuiTypography from "@material-ui/core/Typography";

const ListItem = withStyles({
  root: {
    "&$selected": {
      background: `linear-gradient(90deg, #2AA897, #4FBE75)`,
      color: "white",
    },
    "&$selected:hover": {
      background: `linear-gradient(90deg, #2AA897, #4FBE75)`,
      color: "white",
    },
    "&:hover": {
      background: `linear-gradient(90deg, #2AA897, #4FBE75)`,
      color: "white",
    },
  },
  selected: {},
})(MuiListItem);

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
  },
}));

const Typography = withStyles((theme) => ({
  root: {
    fontWeight: "bold",
    fontFamily: theme.typography.fontFamily,
  },
}))(MuiTypography);

export default function SelectedListItem({ ariaLabel, listItemText }) {
  const classes = useStyles();
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  return (
    <div className={classes.root}>
      <List component="nav" aria-label={ariaLabel}>
        <ListItem
          button
          selected={selectedIndex === 2}
          onClick={(event) => handleListItemClick(event, 2)}
        >
          <ListItemText primary={<Typography>{listItemText[0]}</Typography>} />
        </ListItem>
        <ListItem
          button
          selected={selectedIndex === 3}
          onClick={(event) => handleListItemClick(event, 3)}
        >
          <ListItemText primary={<Typography>{listItemText[1]}</Typography>} />
        </ListItem>
      </List>
    </div>
  );
}
