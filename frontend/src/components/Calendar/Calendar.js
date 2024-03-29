import "date-fns";
import React from "react";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

export default function Calendar(props) {
  const { id, selectedDate, label, onChange, margin } = props;

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        disableToolbar
        variant="inline"
        format="dd/MM/yyyy"
        margin="normal"
        id={id}
        label={label}
        value={selectedDate}
        onChange={onChange}
        KeyboardButtonProps={{
          "aria-label": "change date",
        }}
        style = {{ width: 200, marginLeft: margin}}
      />
    </MuiPickersUtilsProvider>
  );
}