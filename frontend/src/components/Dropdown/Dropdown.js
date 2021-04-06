import React, {useState} from 'react';

import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { loadEvaluation } from "../../requests/requests.js";

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
  const [selectedEvaluation, setEvalution] = useState();

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="age-native-simple">{name}</InputLabel>
        <Select
          native
          value={selectedEvaluation}
          onChange={onChange}
          inputProps={{
            name: 'evaluations',
            id: 'age-native-simple',
          }}
        >
            <option aria-label="None" value="" />
            {list.map((item) =>
             <option value={item[0]}> {item[1]} </option>)}
        </Select>
      </FormControl>
    </div>
  )
}