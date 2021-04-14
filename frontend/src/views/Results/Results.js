import React, {Component} from "react";
// core components
import Button from "@material-ui/core/Button";
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Table from "../../components/Table/Table.js";
import { topQueries } from "../../requests/requests.js";
import Calendar from "../../components/Calendar/Calendar.js";

class Result extends Component {
  state = {
      counters: [
         {id: 1, value: 4},
         {id: 2, value: 0},
         {id: 3, value: 0},
         {id: 4, value: 0},
      ],
      popularQueries: 
      [{
        search_string: 'Loading...',
        n: 'Loading...'
      }],
      startDate: new Date('2021-01-29'),
      endDate: null,
      checkbox: false
    }

  handleCheckbox = (event) => {
    this.setState({ checkbox: event.target.checked });
    this.setState({ endDate: null });
  };

  componentDidMount()
  {
    this.getPopularQueries(this.state.startDate, null)
  }

  getPopularQueries = (startDate, endDate) => {

    this.setState({ popularQueries: [{search_string: 'Loading...',n: 'Loading...'}],});

    topQueries(startDate, endDate)
    .then(res => res.json())
    .then(res => this.setState({ popularQueries: res}) )
  }

  changeStartDate = (date) => {
    this.setState({ startDate: date});
    
    this.getPopularQueries(date, this.state.endDate)
  };

  changeEndDate = (date) => {
    this.setState({ endDate: date});

    this.getPopularQueries(this.state.startDate, date)
  };

  testAPI = (date) => {
      console.log(this.state.checkbox)
  };

  render() { 
      return (
        <div>
          <Calendar 
            selectedDate = {this.state.startDate}
            onChange={this.changeStartDate}
            label = {this.state.checkbox == true ? "Start date" : "Date"}
          />
          <FormControlLabel control={<Checkbox checked={this.state.checkbox} onChange={this.handleCheckbox} name="checkbox" />} label="Date range" />
          {this.state.checkbox == true ? (
          <Calendar 
            selectedDate = {this.state.endDate}
            onChange={this.changeEndDate}
            label="End date"
          /> 
          ): null}
          <Table 
          tableHeaderColor="grey"
          tableHead={["Query", "Occurences"]}
          tableData={this.state.popularQueries}
            />
        </div>
      )
  }

}

/*<Button
color="secondary"
onClick={() => this.testAPI()}
>
  Check checkbox
</Button>*/
export default Result;
