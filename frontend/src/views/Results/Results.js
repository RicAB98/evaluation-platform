import React, {Component} from "react";
// core components
import Button from "@material-ui/core/Button";
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
      startDate: new Date('2021-08-18T21:11:54')
    }

  componentDidMount()
  {
    topQueries()
    .then(res => res.json())
    .then(res => this.setState({ popularQueries: res}) )    
  }

  changeDate = (date) => {
    this.setState({ startDate: date});
  };

  render() { 
      return (
        <div>
          <Calendar 
            selectedDate = {this.state.startDate}
            onChange={this.changeDate}
          />
          <Button
                  color="secondary"
                  onClick={() => this.testAPI()}
                >
                  GET from API
                </Button>
          <Table 
          tableHeaderColor="grey"
          tableHead={["Query", "Percentage"]}
          tableData={this.state.popularQueries}
             />
        </div>
      )
  }

}

export default Result;
