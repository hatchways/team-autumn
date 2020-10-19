import { makeStyles } from '@material-ui/core';

const buttonStyles = makeStyles((theme) => ({
  base: {
    textTransform: 'none',
    height: '3rem',
    fontWeight: 600,
    borderRadius: '5px',
    margin: theme.spacing(3, 0, 2),
  },
  action: {
    background: `linear-gradient(90deg, ${theme.palette.primary.main} , ${theme.palette.secondary.main})`,
    color: 'white',
  },
}));

export default buttonStyles;
