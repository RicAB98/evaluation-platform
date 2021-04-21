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
      this.props.location.search === ""
        ? ""
        : decodeURIComponent(this.props.location.search.replace("?string=", "")),
  };

  componentDidMount() {
    if (this.state.name !== "") this.submitEvaluation();
  }

  changeValue = (event) => {
    this.setState({ name: event.target.value });
  };

  submitEvaluation = () => {
    this.props.history.push({
      pathname: "/admin/query",
      search: "?string=" + this.state.name,
    });

    this.setState({
      optionsClicked: [
        {
          page_number: 1,
          mysql_id: 0,
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
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: 400,
            justifyContent: "space-around",
          }}
        >
          <label
            style={{ marginLeft: 8, marginTop: "auto", marginBottom: "auto" }}
          >
            Query:
            <input
              value={this.state.name}
              onChange={this.changeValue}
              type="text"
              style={{ marginLeft: 8, marginTop: "auto", marginBottom: "auto" }}
            />
          </label>
          <Button color="custom" onClick={() => this.submitEvaluation()}>
            Submit
          </Button>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "left",
          }}
        >
          {this.state.showGraph === true ? (
            <LineChart data={this.state.data} />
          ) : null}
          {this.state.showTable === true ? (
            <Table
              tableTitle="Results clicked"
              tableHeaderColor="gray"
              tableHead={["Rank", "Clicks"]}
              tableData={this.state.optionsClicked}
            />
          ) : null}
        </div>
      </div>
    );
  }
}

export default QueryPerformance;
