import React, { Component } from "react";
import Dropdown from "../../components/Dropdown/Dropdown.js";
import Button from "../../components/Button/Button.js";
import Table from "../../components/Table/Table.js";
import TimelineIcon from '@material-ui/icons/Timeline';

import { runEvaluation } from "../../requests/requests.js";

class Run extends Component {
  state = {
    evaluationTypes: [
      { id: 1, name: "Unsuccessful" },
      { id: 2, name: "Popular" },
      { id: 3, name: "All" },
    ],
    periodTypes: [
      { id: 1, name: "Last hour", minutes: 60 },
      { id: 2, name: "Last 3 hours", minutes: 180 },
      { id: 3, name: "Last 12 hours", minutes: 720 },
      { id: 4, name: "Last day", minutes: 1440 },
    ],
    results: [
      {
        search_string: "Loading...",
        n: "Loading...",
      },
    ],
    showResults: false,
    name: "",
    selectedEvaluation: null,
    selectedPeriod: null,
    popularQueries: [
      {
        search_string: "Loading...",
        n: "Loading...",
      },
    ],
    unsuccessfulQueries: [
      {
        search_string: "Loading...",
        n: "Loading...",
      },
    ],
  };

  changeValue = (event) => {
    this.setState({ name: event.target.value });
  };

  changeEvaluation = (event) => {
    this.setState({ selectedEvaluation: event.target.value });
  };

  changePeriod = (event) => {
    this.setState({ selectedPeriod: event.target.value });
  };

  submitEvaluation = () => {
    let evaluationType = this.state.evaluationTypes[
      this.state.selectedEvaluation - 1
    ];
    let period = this.state.periodTypes[this.state.selectedPeriod - 1];
    let name = this.state.name;

    this.setState({
      popularQueries: [{ search_string: "Loading...", n: "Loading..." }],
    });
    this.setState({
      unsuccessfulQueries: [{ search_string: "Loading...", n: "Loading..." }],
    });
    this.setState({ showResults: true });

    let minute = 60000;

    let currentDate = new Date("2021-01-23 23:59:59");
    let referenceDate = new Date(currentDate - period["minutes"] * minute);

    runEvaluation(name, evaluationType, period, referenceDate, currentDate)
      .then((res) => res.json())
      .then((res) =>
        this.setState({
          unsuccessfulQueries: res["unsuccessful"],
          popularQueries: res["popular"],
        })
      );
  };

  render() {
    return (
      <div style={{ marginLeft: 8 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: 500,
            justifyContent: "space-around",
          }}
        >
          <label
            style={{ marginLeft: 8, marginTop: "auto", marginBottom: "auto" }}
          >
            Name:
            <input
              value={this.state.name}
              onChange={this.changeValue}
              type="text"
              style={{ marginLeft: 8 }}
            />
          </label>
          {/*<Dropdown 
        list={this.state.evaluationTypes} 
        name="Type"
        onChange={this.changeEvaluation}
      />*/}
          <Dropdown
            list={this.state.periodTypes}
            name="Period"
            onChange={this.changePeriod}
            style={{ marginTop: "auto", marginBottom: "auto" }}
          />
          <Button color="custom" onClick={() => this.submitEvaluation()}>
            Run
          </Button>
        </div>
        {this.state.showResults ? (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "75%",
              justifyContent: "space-between",
              marginTop: 20,
              marginLeft: 8,
            }}
          >
            <Table
              tableTitle="Popular queries"
              tableHeaderColor="gray"
              tableHead={["#", "Query", "Occurrences", " "]}
              tableData={this.state.popularQueries}
              firstColumn={["search_string"]}
              secondColumn={["n"]}
              linkIcon={<TimelineIcon />}
            />
            <Table
              tableTitle="Unsuccessful queries"
              tableHeaderColor="gray"
              tableHead={["#", "Query", "Occurrences", " "]}
              tableData={this.state.unsuccessfulQueries}
              firstColumn={["search_string"]}
              secondColumn={["n"]}
              linkIcon={<TimelineIcon />}
            />
          </div>
        ) : null}
      </div>
    );
  }
}

export default Run;
