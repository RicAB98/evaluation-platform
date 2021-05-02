import React, { Component } from "react";

// core components
import MenuBookIcon from "@material-ui/icons/MenuBook";
import ZzIcon from "../../assets/img/logo.png";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import Button from "../../components/Button/Button.js";
import Table from "../../components/Table/Table.js";
import Table2 from "../../components/Table/Table2.js";
import TimePicker from "../../components/Calendar/TimePicker.js";
import Calendar from "../../components/Calendar/Calendar.js";
import Chart from "../../components/Chart/Chart";
import {
  queryGraph,
  getClicksRanks,
  getPagesPerRank,
  getUnsuccessfulSessions,
} from "../../requests/requests.js";

class QueryPerformance extends Component {
  state = {
    startDate: new Date(),
    endDate: new Date(),
    calculatedStartDate: null,
    calculatedEndDate: null,

    string: "",
    checkbox: false,

    showGraph: false,
    graphStartDate: null,
    graphEndDate: null,

    showClickRank: false,
    calculatedString: null,
    unsuccessfulSessions: "",

    showPagesPerRank: false,
    calculatedRank: null,

    graphData: {
      string: "Loading..",
    },

    showedGraphData: {
      string: "Loading..",
    },

    clickRank: [
      {
        rank: "Loading...",
        n: "Loading...",
      },
    ],

    pagesPerRank: [
      {
        page: "Loading...",
        mysql_id: "Loading...",
        n: "Loading...",
      },
    ],
  };

  componentDidMount() {
    let search = window.location.search;
    let params = new URLSearchParams(search);

    let string = params.get("search_string");
    let startDate = params.get("startDate");
    let endDate = params.get("endDate");

    this.setState({
      string: string != null ? string : "",
      startDate: startDate != null ? new Date(startDate) : new Date(),
      endDate: endDate != null ? new Date(endDate) : new Date(),
      checkbox: endDate != null ? true : false,
    },
    () => {if(string != null && startDate != null)
            this.submitEvaluation()
    });
  }

  toISOString(date) {
    let month =
      date.getMonth() <= 9
        ? "0" + this.addOne(date.getMonth())
        : this.addOne(date.getMonth());
    let day = date.getDate() <= 9 ? "0" + date.getDate() : date.getDate();
    let hours = date.getHours() <= 9 ? "0" + date.getHours() : date.getHours();
    let minutes =
      date.getMinutes() <= 9 ? "0" + date.getMinutes() : date.getMinutes();

    return (
      date.getFullYear() + "-" + month + "-" + day + "T" + hours + ":" + minutes
    );
  }
  
  toRegularFormat(date) {
    return (
      date.getFullYear() +
      "-" +
      this.addOne(date.getMonth()) +
      "-" +
      date.getDate()
    );
  }

  toISOString(date) {
    let month =
      date.getMonth() <= 9
        ? "0" + this.addOne(date.getMonth())
        : this.addOne(date.getMonth());
    let day = date.getDate() <= 9 ? "0" + date.getDate() : date.getDate();
    let hours = date.getHours() <= 9 ? "0" + date.getHours() : date.getHours();
    let minutes =
      date.getMinutes() <= 9 ? "0" + date.getMinutes() : date.getMinutes();

    return (
      date.getFullYear() + "-" + month + "-" + day + "T" + hours + ":" + minutes
    );
  }

  changeValue = (event) => {
    this.setState({ string: event.target.value });
  };

  handleCheckbox = (event) => {
    this.setState({ checkbox: event.target.checked });
  };

  submitPagesPerRank = (page, mysql_id) => {
    let calculatedRank = page === "20+" ? "20+" : 10 * (page - 1) + mysql_id;

    this.setState({
      calculatedRank: calculatedRank,
      pagesPerRank: [
        {
          page: "Loading...",
          mysql_id: "Loading...",
          n: "Loading...",
        },
      ],
    });

    getPagesPerRank(
      page,
      mysql_id,
      this.state.calculatedString,
      this.state.calculatedStartDate,
      this.state.calculatedEndDate
    )
      .then((res) => res.json())
      .then(
        (res) => this.setState({ pagesPerRank: res }),
        this.setState({ showPagesPerRank: true })
      );
  };

  submitEvaluation = () => {

    let urlSearch =
      "?search_string=" +
      this.state.string +
      "&startDate=" +
      this.toISOString(this.state.startDate);

    urlSearch +=
      this.state.checkbox == true
        ? "&endDate=" + this.toISOString(this.state.endDate)
        : "";

    this.props.history.push({
      pathname: "/admin/query",
      search: urlSearch,
    });

    this.setState({
      calculatedString: this.state.string,
      calculatedStartDate: this.state.startDate,
      calculatedEndDate: this.state.checkbox == true ? this.state.endDate : null,
      showGraph: false,
      showPagesPerRank: false,
      unsuccessfulSessions: "",
      clickRank: [
        {
          page_number: 1,
          mysql_id: 0,
          n: "Loading...",
        },
      ],
      graphData: {
        string: "Loading..",
      },
      showedGraphData: {
        string: "Loading..",
      },
      graphStartDate: null,
      graphEndDate: null,
    });

    if (this.state.checkbox == true)
      queryGraph(this.state.string, this.state.startDate, this.state.endDate)
        .then((res) => res.json())
        .then(
          (res) =>
            this.setState({
              graphData: res,
              showedGraphData: res,
              graphStartDate: new Date(res["dates"][0]),
              graphEndDate: new Date(res["dates"][res["dates"].length - 1]),
            }),
          this.setState({ showGraph: true })
        );

    getClicksRanks(
      this.state.string,
      this.state.startDate,
      this.state.checkbox == true ? this.state.endDate : null
    )
      .then((res) => res.json())
      .then(
        (res) => this.setState({ clickRank: res }),
        this.setState({ showClickRank: true })
      );
    getUnsuccessfulSessions(
      this.state.string,
      this.state.startDate,
      this.state.checkbox == true ? this.state.endDate : null
    )
      .then((res) => res.json())
      .then((res) => this.setState({ unsuccessfulSessions: res["n"] }));
  };

  changeStartDate = (event) => {
    this.setState({ startDate: new Date(event.target.value) });
  };

  changeEndDate = (event) => {
    this.setState({ endDate: new Date(event.target.value) });
  };

  changeGraphStartDate = (newDate) => {
    let formatedDate =
      newDate.getFullYear() +
      "-" +
      this.addOne(newDate.getMonth()) +
      "-" +
      newDate.getDate();
    let dateArray = this.state.graphData["dates"];
    let closerDateInArray = newDate;

    if (newDate > this.state.graphEndDate) return;

    if (dateArray.indexOf(formatedDate) === -1) {
      let rangeStart = new Date(dateArray[0]);
      let rangeEnd = new Date(dateArray[dateArray.length - 1]);

      if (newDate < rangeStart || newDate > rangeEnd) return;
    }

    this.setState({ graphStartDate: newDate });
    this.changeGraphRange(closerDateInArray, this.state.graphEndDate);
  };

  changeGraphEndDate = (newDate) => {
    let formatedDate =
      newDate.getFullYear() +
      "-" +
      this.addOne(newDate.getMonth()) +
      "-" +
      newDate.getDate();
    let dateArray = this.state.graphData["dates"];
    let closerDateInArray = newDate;

    if (newDate < this.state.graphStartDate) return;

    if (dateArray.indexOf(formatedDate) === -1) {
      let rangeStart = new Date(dateArray[0]);
      let rangeEnd = new Date(dateArray[dateArray.length - 1]);

      if (newDate < rangeStart || newDate > rangeEnd) return;
    }

    this.setState({ graphEndDate: newDate });
    this.changeGraphRange(this.state.graphStartDate, closerDateInArray);
  };

  changeGraphRange(startDate, endDate) {
    let string = this.state.graphData["string"];
    let dates = this.state.graphData["dates"];
    let clicks = this.state.graphData["clicks"];

    let closerStartDate = this.closerDateInArray(startDate, "start");
    let closerEndDate = this.closerDateInArray(endDate, "end");

    let formatedStartDate =
      closerStartDate.getFullYear() +
      "-" +
      this.addOne(closerStartDate.getMonth()) +
      "-" +
      closerStartDate.getDate();
    let formatedEndDate =
      closerEndDate.getFullYear() +
      "-" +
      this.addOne(closerEndDate.getMonth()) +
      "-" +
      closerEndDate.getDate();

    this.setState({
      showedGraphData: {
        string: string,
        dates: dates.slice(
          dates.indexOf(formatedStartDate),
          dates.indexOf(formatedEndDate) + 1
        ),
        clicks: clicks.slice(
          dates.indexOf(formatedStartDate),
          dates.indexOf(formatedEndDate) + 1
        ),
      },
    });
  }

  closerDateInArray(date, type) {
    let dateArray = this.state.graphData["dates"];

    if (type === "start")
      return new Date(dateArray.find((element) => new Date(element) >= date));
    else if (type === "end") {
      let dateArrayCopy = dateArray.slice();

      return new Date(
        dateArrayCopy.reverse().find((element) => new Date(element) <= date)
      );
    }
  }

  addOne(value) {
    return value + 1;
  }

  render() {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: 900,
            justifyContent: "space-around",
          }}
        >
          <label
            style={{ marginLeft: 8, marginTop: "auto", marginBottom: "auto" }}
          >
            Query:
            <input
              value={this.state.string}
              onChange={this.changeValue}
              type="text"
              style={{ marginLeft: 8, marginTop: "auto", marginBottom: "auto" }}
            />
          </label>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "start",
            }}
          >
            <TimePicker
              selectedDate={this.state.startDate}
              onChange={this.changeStartDate}
              label={this.state.checkbox === true ? "Start date" : "Date"}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.checkbox}
                  onChange={this.handleCheckbox}
                  style={{ color: "#2c3e50" }}
                  name="checkbox"
                />
              }
              label="Date range"
              style={{ marginTop: "auto", marginBottom: "auto" }}
            />
          </div>
          {this.state.checkbox === true ? (
            <TimePicker
              selectedDate={this.state.endDate}
              onChange={this.changeEndDate}
              label="End date"
              margin="20px"
            />
          ) : null}

          <Button color="custom" onClick={() => this.submitEvaluation()}>
            Submit
          </Button>
        </div>

        <div style={{ marginTop: 20 }}>
          <GridContainer>
            <GridItem
              xs={this.state.showPagesPerRank === true ? 12 : 18}
              sm={this.state.showPagesPerRank === true ? 12 : 18}
              md={this.state.showPagesPerRank === true ? 4 : 6}
              style={{ backgroundColor: this.state.showGraph === true ? "#E8E8E8": "inherit" }}
            >
              {this.state.showGraph === true ? (
                <div>
                  <Chart
                    string={this.state.showedGraphData["string"]}
                    labels={this.state.showedGraphData["dates"]}
                    data={this.state.showedGraphData["clicks"]}
                    smaller = {false}
                    displayLegend = {true}
                    displayTitle = {true}
                    displayX = {true}
                    displayXLegend = {true}
                    displayYLegend = {true}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      width: 800,
                    }}
                  >
                    <Calendar
                      id="startDate"
                      selectedDate={this.state.graphStartDate}
                      onChange={this.changeGraphStartDate}
                      label="Start date"
                    />
                    <Calendar
                      id="endDate"
                      selectedDate={this.state.graphEndDate}
                      onChange={this.changeGraphEndDate}
                      label="End date"
                      margin="20px"
                    />
                  </div>
                </div>
              ) : null}
            </GridItem>
            {this.state.showClickRank === true ? (
              <GridItem
                xs={this.state.showPagesPerRank === true ? 12 : 18}
                sm={this.state.showPagesPerRank === true ? 12 : 18}
                md={this.state.showPagesPerRank === true ? 4 : 6}
              >
                <Table2
                  tableTitle={
                    "Clicks' rank for query \"" +
                    this.state.calculatedString +
                    '"'
                  }
                  tableHeaderColor="gray"
                  tableHead={["Rank", "Clicks", ""]}
                  tableData={this.state.clickRank}
                  onClick={this.submitPagesPerRank}
                />
                <h6 style={{ marginTop: 10 }}>
                  Sessions without a click: {this.state.unsuccessfulSessions}{" "}
                </h6>
              </GridItem>
            ) : null}
            <GridItem xs={12} sm={12} md={4}>
              {this.state.showPagesPerRank === true ? (
                <Table
                  tableTitle={
                    "Clicked pages on rank " + this.state.calculatedRank
                  }
                  tableHeaderColor="gray"
                  tableHead={["#", "Ids", "Count", "", ""]}
                  tableData={this.state.pagesPerRank}
                  firstColumn={["partialUrl"]}
                  secondColumn={["n"]}
                  localLinkPath="localUrl"
                  localLinkAditionalInfo={
                    "&startDate=" + this.toISOString(this.state.calculatedStartDate) + 
                    (this.state.calculatedEndDate !== null ? "&endDate=" + this.toISOString(this.state.calculatedEndDate) : "")
                    }
                  localLinkIcon={<MenuBookIcon />}
                  externalLink={true}
                  externalLinkPath="fullUrl"
                  externalLinkIcon={<img width="25" src={ZzIcon} />}
                />
              ) : null}
            </GridItem>
          </GridContainer>
        </div>
      </div>
    );
  }
}

export default QueryPerformance;
