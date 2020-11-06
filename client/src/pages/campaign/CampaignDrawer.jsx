import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';

import ListSelect from '../../components/ListSelect';

const IOSSwitch = withStyles((theme) => ({
  root: {
    width: 42,
    height: 26,
    padding: 0,
    margin: theme.spacing(3),
  },
  switchBase: {
    padding: 1,
    '&$checked': {
      transform: 'translateX(16px)',
      color: theme.palette.common.white,
      '& + $track': {
        backgroundColor: '#52d869',
        opacity: 1,
        border: 'none',
      },
    },
    '&$focusVisible $thumb': {
      color: '#52d869',
      border: '6px solid #fff',
    },
  },
  thumb: {
    width: 24,
    height: 24,
  },
  track: {
    borderRadius: 26 / 2,
    border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: theme.palette.grey[50],
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border']),
  },
  checked: {},
  focusVisible: {},
}))(({ classes, ...props }) => (
  <Switch
    focusVisibleClassName={classes.focusVisible}
    disableRipple
    classes={{
      root: classes.root,
      switchBase: classes.switchBase,
      thumb: classes.thumb,
      track: classes.track,
      checked: classes.checked,
    }}
    {...props}
  />
));

const SwitchLabel = ({ labelText }) => (
  <Typography style={{ fontWeight: 'bold ' }}>{labelText}</Typography>
);

// will grab a dispatched function from CampaignContext to edit campaign state
const CampaignDrawer = () => (
  <div
    style={{
      height: '100%',
    }}
  >
    <FormGroup style={{ marginBottom: '2em' }}>
      <FormControlLabel
        control={
          <IOSSwitch
            onChange={() => console.log('I will eventually handle some state!')}
            name="checkedB"
          />
        }
        label={<SwitchLabel labelText="Active" />}
        labelPlacement="start"
      />
    </FormGroup>
    <ListSelect
      ariaLabel="campaign select options"
      listItemText={['SUMMARY', 'PROSPECTS']}
      listHeader="Select View"
      listType="Select View"
      isBold
    />
  </div>
);
export default CampaignDrawer;
