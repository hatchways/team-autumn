import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Link, useHistory } from 'react-router-dom';

import { tabNavStyles } from '../assets/styles';

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

const TabNav = ({ tabs, initialState }) => {
  const classes = tabNavStyles();
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
