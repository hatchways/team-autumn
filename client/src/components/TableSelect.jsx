import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function SimpleSelect() {
  const classes = useStyles();
  const [first, setFirst] = useState('first_name');
  const [second, setSecond] = useState('last_name');
  const [third, setThird] = useState('email');

  const handleChange = (event) => {
    if (event.target.name === 'first-header') {
      setFirst(event.target.value);
    }
    if (event.target.name === 'second-header') {
      setSecond(event.target.value);
    }
    if (event.target.name === 'third-header') {
      setThird(event.target.value);
    }
  };

  return (
    <div>
      <FormControl className={classes.formControl}>
        <Select id="first-header" name="first-header" value={first} onChange={handleChange}>
          <MenuItem value="first_name">First Name</MenuItem>
          <MenuItem value="last_name">Last Name</MenuItem>
          <MenuItem value="email">Email</MenuItem>
        </Select>
      </FormControl>
      <FormControl className={classes.formControl}>
        <Select id="second-header" name="second-header" value={second} onChange={handleChange}>
          <MenuItem value="first_name">First Name</MenuItem>
          <MenuItem value="last_name">Last Name</MenuItem>
          <MenuItem value="email">Email</MenuItem>
        </Select>
      </FormControl>
      <FormControl className={classes.formControl}>
        <Select id="third-header" name="third-header" value={third} onChange={handleChange}>
          <MenuItem value="first_name">First Name</MenuItem>
          <MenuItem value="last_name">Last Name</MenuItem>
          <MenuItem value="email">Email</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
