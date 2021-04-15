import React, {Component} from "react";
// core components
import Button from "@material-ui/core/Button";
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Table from "../../components/Table/Table.js";
import Calendar from "../../components/Calendar/Calendar.js";
import LineChart from "../../components/Chart/LineChart";
import { topQueries, unsuccessfulQueries} from "../../requests/requests.js";

class Result extends Component {
  state = {
      popularQueries: 
      [{
        search_string: 'Loading...',
        n: 'Loading...'
      }],
      unsuccessfulQueries: 
      [{
        search_string: 'Loading...',
        n: 'Loading...'
      }],
      startDate: new Date('2021-01-20'),
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
    this.getUnsuccessfulQueries(this.state.startDate, null)
  }

  getPopularQueries = (startDate, endDate) => {

    this.setState({ popularQueries: [{search_string: 'Loading...',n: 'Loading...'}],});

    topQueries(startDate, endDate)
    .then(res => res.json())
    .then(res => this.setState({ popularQueries: res}) )
  }

  getUnsuccessfulQueries = (startDate, endDate) => {

    this.setState({ unsuccessfulQueries: [{search_string: 'Loading...',n: 'Loading...'}],});

    unsuccessfulQueries(startDate, endDate)
    .then(res => res.json())
    .then(res => this.setState({ unsuccessfulQueries: res}) )
  }

  changeStartDate = (date) => {
    this.setState({ startDate: date});
    
    this.getPopularQueries(date, this.state.endDate)
    this.getUnsuccessfulQueries(date, this.state.endDate)
  };

  changeEndDate = (date) => {
    this.setState({ endDate: date});

    this.getPopularQueries(this.state.startDate, date)
    this.getUnsuccessfulQueries(this.state.startDate, date)
  };

  testAPI = (date) => {
      console.log(this.state.checkbox)
  };

  render() { 
      return (
        <div>         
          <div style= {{ display:"flex", 
                         flexDirection: "column",
                      }}>
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
          </div>
          <div style= {{ display:"flex", 
                         flexDirection: "row", 
                         width: "75%", 
                         justifyContent: "space-between",
                      }}>
            <Table 
              tableTitle="Popular queries"
              tableHeaderColor="grey"
              tableHead={["#", "Query", "Occurrences"]}
              tableData={this.state.popularQueries}
            />
            <Table 
              tableTitle="Unsuccessful queries"
              tableHeaderColor="grey"
              tableHead={["#", "Query", "Occurrences"]}
              tableData={this.state.unsuccessfulQueries}
            />
          </div>
        </div>
      )
  }
}

export default Result;
