import React, { Component } from "react";
// core components

import Button from "../../components/Button/Button.js";
import LineChart from "../../components/Chart/LineChart";
import Table from "../../components/Table/Table2.js";
import { queryGraph, queryTable } from "../../requests/requests.js";

class QueryPerformance extends Component {
  state = {
    startDate: new Date("2021-01-29"),
    endDate: null,
    showGraph: false,
    showTable: false,
    optionsClicked: [
      {
        rank: "Loading...",
        n: "Loading...",
      },
    ],
    data: [
      {
        id: "loading",
        color: "hsl(0, 70%, 50%)",
        data: [
          {
            x: "20-01",
            y: 0,
          },
        ],
      },
    ],
    name:
      this.props.location.state != null ? this.props.location.state.string : "",
  };

  componentDidMount() {
    if (this.state.name != "") this.submitEvaluation();
  }

  changeValue = (event) => {
    this.setState({ name: event.target.value });
  };

  submitEvaluation = () => {
    console.log("dsds");

    this.setState({
      optionsClicked: [
        {
          rank: "Loading...",
          n: "Loading...",
        },
      ],
    });

    this.setState({
      data: [
        {
          id: "loading",
          color: "hsl(0, 70%, 50%)",
          data: [
            {
              x: "20-01",
              y: 0,
            },
          ],
        },
      ],
    });

    queryGraph(this.state.name)
      .then((res) => res.json())
      .then(
        (res) => this.setState({ data: res }),
        this.setState({ showGraph: true })
      );
    queryTable(this.state.name)
      .then((res) => res.json())
      .then(
        (res) => this.setState({ optionsClicked: res }),
        this.setState({ showTable: true })
      );
  };

  render() {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label style={{ marginLeft: 8 }}>
          Query:
          <input
            value={this.state.name}
            onChange={this.changeValue}
            type="text"
            style={{ marginLeft: 8 }}
          />
        </label>
        <Button
          color="custom"
          onClick={() => this.submitEvaluation()}
          style={{ width: 100 }}
        >
          Submit
        </Button>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "left",
          }}
        >
          {this.state.showGraph == true ? (
            <LineChart data={this.state.data} />
          ) : null}
          {this.state.showTable == true ? (
            <Table
              tableTitle="Results clicked"
              tableHeaderColor="grey"
              tableHead={["#", "Rank", "Occurrences"]}
              tableData={this.state.optionsClicked}
            />
          ) : null}
        </div>
      </div>
    );
  }
}

export default QueryPerformance;
