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
  const { evaluationList } = props;
  const [selectedEvaluation, setEvalution] = useState();

  const handleChange = (event) => {
    setEvalution(event.target.value);  
  };

  const submitEvaluation = () => {
        const formData = new FormData();

        console.log(selectedEvaluation)

        loadEvaluation(selectedEvaluation)
        .then(res => res.text())
        .then(res => console.log(res))
    };

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="age-native-simple">Evaluations</InputLabel>
        <Select
          native
          value={selectedEvaluation}
          onChange={handleChange}
          inputProps={{
            name: 'evaluations',
            id: 'age-native-simple',
          }}
        >
            <option aria-label="None" value="" />
            {evaluationList.map((item) =>
             <option value={item[0]}> {item[1]} </option>)}
        </Select>
      </FormControl>
        <div>
                <button onClick={submitEvaluation}>Submit</button>
        </div>
      </div>
  )
}