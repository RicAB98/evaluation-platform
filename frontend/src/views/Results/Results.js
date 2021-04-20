import React, { Component } from "react";
// core components
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Button from "../../components/Button/Button.js";

import Table from "../../components/Table/Table.js";
import Calendar from "../../components/Calendar/Calendar.js";
import {
  topQueries,
  unsuccessfulQueries,
  loadDailyEvaluation,
} from "../../requests/requests.js";

class Result extends Component {
  state = {
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
    startDate: new Date("2021-01-20 0:0:0"),
    endDate: null,
    checkbox: false,
  };

  handleCheckbox = (event) => {
    this.setState({ checkbox: event.target.checked });
    this.setState({ endDate: null });
  };

  submitEvaluation() {
    loadDailyEvaluation(this.state.startDate)
      .then((res) => res.json())
      .then((res) =>
        this.setState(
          { popularQueries: JSON.parse(res[0]["popular"]) },
          this.setState({
            unsuccessfulQueries: JSON.parse(res[0]["unsuccessful"]),
          })
        )
      );

    return;

    let startDate = new Date(this.state.startDate);
    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);

    if (this.state.endDate != null) {
      let endDate = new Date(this.state.endDate);
      endDate.setHours(23);
      endDate.setMinutes(59);
      endDate.setSeconds(59);

      this.getPopularQueries(startDate, endDate);
      this.getUnsuccessfulQueries(startDate, endDate);
    } else {
      this.getPopularQueries(startDate, this.state.endDate);
      this.getUnsuccessfulQueries(startDate, this.state.endDate);
    }
  }

  getPopularQueries = (startDate, endDate) => {
    this.setState({
      popularQueries: [{ search_string: "Loading...", n: "Loading..." }],
    });

    topQueries(startDate, endDate)
      .then((res) => res.json())
      .then((res) => this.setState({ popularQueries: res }));
  };

  getUnsuccessfulQueries = (startDate, endDate) => {
    this.setState({
      unsuccessfulQueries: [{ search_string: "Loading...", n: "Loading..." }],
    });

    unsuccessfulQueries(startDate, endDate)
      .then((res) => res.json())
      .then((res) => this.setState({ unsuccessfulQueries: res }));
  };

  changeStartDate = (date) => {
    this.setState({ startDate: date });
  };

  changeEndDate = (date) => {
    this.setState({ endDate: date });
  };

  render() {
    return (
      <div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Calendar
            selectedDate={this.state.startDate}
            onChange={this.changeStartDate}
            label={this.state.checkbox === true ? "Start date" : "Date"}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={this.state.checkbox}
                onChange={this.handleCheckbox}
                name="checkbox"
              />
            }
            label="Date range"
          />
          {this.state.checkbox === true ? (
            <Calendar
              selectedDate={this.state.endDate}
              onChange={this.changeEndDate}
              label="End date"
            />
          ) : null}
          <Button
            color="custom"
            onClick={() => this.submitEvaluation()}
            style={{ width: 100 }}
          >
            Submit
          </Button>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "75%",
            justifyContent: "space-between",
          }}
        >
          <Table
            tableTitle="Popular queries"
            tableHeaderColor="gray"
            tableHead={["#", "Query", "Occurrences", " "]}
            tableData={this.state.popularQueries}
          />
          <Table
            tableTitle="Unsuccessful queries"
            tableHeaderColor="gray"
            tableHead={["#", "Query", "Occurrences", " "]}
            tableData={this.state.unsuccessfulQueries}
          />
        </div>
      </div>
    );
  }
}

export default Result;
