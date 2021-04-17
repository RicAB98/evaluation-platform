import React, {Component} from "react";
import Dropdown from "../../components/Dropdown/Dropdown.js";
import Button from "../../components/Button/Button.js";
import Table from "../../components/Table/Table.js";

import { topQueries, unsuccessfulQueries} from "../../requests/requests.js";

class Run extends Component {
  state = {
    evaluationTypes: [
      [1, "Unsuccessful"],
      [2, "Popular"],
      [3, "All"]
    ],
    periodTypes: [
      [1, "Last hour", 60],
      [2, "Last 3 hours", 180],
      [3, "Last 12 hours", 720],
      [4, "Last day", 1440],
    ],
    results: 
      [{
        search_string: 'Loading...',
        n: 'Loading...'
      }],
    showResults: false,
    name: '',
    selectedEvaluation: null,
    selectedPeriod: null,
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
  }

  changeValue = (event) => {
    this.setState({ name: event.target.value});
  };

  changeEvaluation = (event) => {
    this.setState({ selectedEvaluation: event.target.value});
  };

  changePeriod = (event) => {
    this.setState({ selectedPeriod: event.target.value});
  };

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

  submitEvaluation = () => {
    let evaluationType = this.state.evaluationTypes[this.state.selectedEvaluation - 1]
    let period = this.state.periodTypes[this.state.selectedPeriod - 1]
    let name = this.state.name

    this.setState({ showResults: true});
  
    let minute = 60000;

    let currentDate = new Date('2021-01-23 23:59:59');
    let referenceDate = new Date(currentDate - period[2] * minute)

    topQueries(referenceDate, currentDate)
    .then(res => res.json())
    .then(res => this.setState({ popularQueries: res}) )

    unsuccessfulQueries(referenceDate, currentDate)
    .then(res => res.json())
    .then(res => this.setState({ unsuccessfulQueries: res}) )
  };

  render() {
    return (
    <div>
      <label style={{ marginLeft: 8 }}>
        Name:
        <input 
          defaultValue="Default"
          value={this.state.name} 
          onChange={this.changeValue}
          type="text"
          style={{ marginLeft: 8 }}
        />
      </label>
      <Dropdown 
        list={this.state.evaluationTypes} 
        name="Type"
        onChange={this.changeEvaluation}
      />
      <Dropdown 
        list={this.state.periodTypes} 
        name="Period"
        onChange={this.changePeriod}
      />
      <Button
        color="custom"
        onClick={() => this.submitEvaluation()}
      >
        Run
      </Button>
      { this.state.showResults ? 
        <div style= {{ display:"flex", 
        flexDirection: "row", 
        width: "75%", 
        justifyContent: "space-between",
        }}>
        <Table 
        tableTitle="Popular queries"
        tableHeaderColor="grey"
        tableHead={["#", "Query", "Occurrences", ' ']}
        tableData={this.state.popularQueries}
        />
        <Table 
        tableTitle="Unsuccessful queries"
        tableHeaderColor="grey"
        tableHead={["#", "Query", "Occurrences", ' ']}
        tableData={this.state.unsuccessfulQueries}
        />
      </div> : null}
    </div>)
  }
}

export default Run;
