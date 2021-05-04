import "date-fns";
import React from "react";

import { makeStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';


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

  const toISOString = (date) => {
    let month = date.getMonth() <= 9 ? "0" + addOne(date.getMonth()) : addOne(date.getMonth());
    let day = date.getDate() <= 9 ? "0" + date.getDate() : date.getDate();
    let hours = date.getHours() <= 9 ? "0" + date.getHours() : date.getHours();
    let minutes = date.getMinutes() <= 9 ? "0" + date.getMinutes() : date.getMinutes();

    return (
      date.getFullYear() +
      "-" +
      month +
      "-" +
      day +
      "T" +
      hours +
      ":" +
      minutes
    );

  }

  const addOne = (value) => {
    return value + 1;
  }

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
