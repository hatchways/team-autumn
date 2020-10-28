import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import MuiListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Typography from '@material-ui/core/Typography';

import generateUniqueId from '../util/generateUniqueId';

const ListItem = withStyles({
  root: {
    '&$selected': {
      background: `linear-gradient(90deg, #2AA897, #4FBE75)`,
      color: 'white',
    },
    '&$selected:hover': {
      background: `linear-gradient(90deg, #2AA897, #4FBE75)`,
      color: 'white',
    },
    '&:hover': {
      background: `linear-gradient(90deg, #2AA897, #4FBE75)`,
      color: 'white',
    },
  },
  selected: {},
})(MuiListItem);

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
  },
  text: {
    fontFamily: theme.typography.fontFamily,
  },
  bold: {
    fontWeight: 'bold',
  },
}));

export default function SelectedListItem({
  ariaLabel,
  listItemText,
  listType,
  listHeader,
  isBold,
  selectItem,
}) {
  const classes = useStyles();
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
    selectItem(index - 1);
  };

  return (
    <div className={classes.root}>
      <List component="nav" aria-label={ariaLabel}>
        <ListSubheader>{listHeader}</ListSubheader>
        {listItemText.map((listItem, index) => (
          <ListItem
            key={`${generateUniqueId(listType)}`}
            button
            selected={selectedIndex === index + 1}
            onClick={(event) => handleListItemClick(event, index + 1)}
          >
            <ListItemText
              primary={
                <Typography className={`${classes.text} ${isBold ? classes.bold : ''}`}>
                  {listItem}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
}
