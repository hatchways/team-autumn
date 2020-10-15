import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Link, useHistory } from 'react-router-dom';

const LinkTab = (props) => {
  const history = useHistory();
  const { to } = props;

  return (
    <Tab
      component={Link}
      onClick={(e) => {
        e.preventDefault();
        history.push(to);
      }}
      {...props}
    />
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  tabLink: {
    textTransform: 'none',
    borderColor: theme.palette.secondary.main,
    fontWeight: 600,
    '&[aria-selected="true"] > span': {
      color: theme.palette.secondary.main,
    },
  },
}));

const TabNav = ({ tabs }) => {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Tabs className={classes.root} value={value} onChange={handleChange} aria-label="main-nav-tabs">
      {tabs.map((tab) => (
        <LinkTab
          className={classes.tabLink}
          label={tab.label}
          to={tab.to}
          id={`nav-tab-${tab.id}`}
          key={tab.id}
        />
      ))}
    </Tabs>
  );
};

export default TabNav;
