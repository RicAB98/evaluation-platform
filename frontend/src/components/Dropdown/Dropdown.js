import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function Dropdown(props) {
  const classes = useStyles();
  const { list, name, onChange } = props;
  const [selectedEvaluation] = useState();

  return (
    <div>
      <FormControl  className={classes.formControl}>
        <InputLabel style = {{ marginTop:"auto", marginBottom:"auto"}}   htmlFor="age-native-simple">{name}</InputLabel>
        <Select
          native
          value={selectedEvaluation}
          onChange={onChange}
          inputProps={{
            name: "evaluations",
            id: "age-native-simple",
          }}  
        >
          <option key="0" aria-label="None" value="" />
          {list.map((item) => (
            <option key={item["id"]} value={item["id"]}>  {item["name"]} </option>
             
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
