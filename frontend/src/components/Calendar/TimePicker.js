import "date-fns";
import React from "react";

import { makeStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';

import { toISOString } from "../../utils/utils.js" 

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

export default function TimePicker(props) {
  const { id, selectedDate, label, onChange, margin } = props;
  const classes = useStyles();

  return (
    <form className={classes.container} noValidate>
      <TextField
        id={id}
        label={label}
        type="datetime-local"
        value={toISOString(selectedDate)}
        className={classes.textField}
        onChange={onChange}
        InputLabelProps={{
          shrink: true,
        }}
        style = {{ width: 200, marginLeft: margin}}
      />
    </form>
  );
}
