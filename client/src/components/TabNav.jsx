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
    flexGrow: 0.2,
    backgroundColor: theme.palette.background.paper,
    minHeight: 64,
  },
  tabLink: {
    textTransform: 'none',
    fontWeight: 700,
    '&[aria-selected="true"] > span': {
      color: theme.palette.primary.light,
    },
    paddingTop: 16,
    paddingLeft: 0,
    paddingRight: 0,
  },
  topIndicator: {
    top: 0,
    height: 4,
  },
}));

const TabNav = ({ tabs, initialState }) => {
  const classes = useStyles();
  const [value, setValue] = useState(initialState);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Tabs
      className={classes.root}
      classes={{ indicator: classes.topIndicator }}
      value={value}
      onChange={handleChange}
      aria-label="main-nav-tabs"
    >
      {tabs.map((tab) => (
        <LinkTab
          className={classes.tabLink}
          label={tab.label}
          to={tab.to}
          id={tab.id}
          key={tab.id}
        />
      ))}
    </Tabs>
  );
};

export default TabNav;
