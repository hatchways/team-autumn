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

const TabNav = () => {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Tabs className={classes.root} value={value} onChange={handleChange} aria-label="nav-tabs">
      <LinkTab
        className={classes.tabLink}
        label="Campaigns"
        to="/campaigns"
        id="nav-tab-campaigns"
      />
      <LinkTab
        className={classes.tabLink}
        label="Prospects"
        to="/prospects"
        id="nav-tab-prospects"
      />
      <LinkTab
        className={classes.tabLink}
        label="Templates"
        to="/templates"
        id="nav-tab-templates"
      />
      <LinkTab
        className={classes.tabLink}
        label="Reporting"
        to="/reporting"
        id="nav-tab-reporting"
      />
    </Tabs>
  );
};

export default TabNav;
