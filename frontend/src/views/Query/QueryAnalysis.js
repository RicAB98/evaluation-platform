import React, { Component } from "react";
import { Helmet } from 'react-helmet';

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
import List from "../../components/List/List";

import {
  queryGraph,
  getClicksRanks,
  getPagesPerRank,
  getUnsuccessfulSessions,
  getQuerySummary
} from "../../requests/requests.js";
import { toISOString, addOne } from "../../utils/utils.js"

class QueryAnalysis extends Component {
  state = {
    startDate: new Date(),
    endDate: new Date(),
    today: new Date("2021-01-31"),
    calculatedStartDate: null,
    calculatedEndDate: null,

    string: "",
    dateRange: false,

    showGraph: false,
    graphStartDate: null,
    graphEndDate: null,

    showSummaries: false,
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

    querySummary: [{
      avgRank: 0,
      oneCount: 0,
      totalClicks: 0,
      totalLast24h: 0,
      totalPrevious24h: 0,
      average7days: 0,
      totalLast7days: 0,
    }],

    last24HourSummary: [{
      avgRank: 0,
      oneCount: 0,
      totalClicks: 0,
      totalLast24h: 0,
      totalPrevious24h: 0,
      average7days: 0,
      totalLast7days: 0,
    }],

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
      dateRange: endDate != null ? true : false,
    },
    () => {if(string != null && startDate != null)
            this.submitEvaluation()
    });
  }

  changeValue = (event) => {
    this.setState({ string: event.target.value });
  };

  handleCheckbox = (event) => {
    this.setState({ dateRange: event.target.checked });
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
      addOne(newDate.getMonth()) +
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
      addOne(newDate.getMonth()) +
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
      addOne(closerStartDate.getMonth()) +
      "-" +
      closerStartDate.getDate();
    let formatedEndDate =
      closerEndDate.getFullYear() +
      "-" +
      addOne(closerEndDate.getMonth()) +
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

  resetInformation()
  {
    this.setState({
      calculatedString: this.state.string,
      calculatedStartDate: this.state.startDate,
      calculatedEndDate: this.state.dateRange == true ? this.state.endDate : null,
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
      querySummary: [{
        avgRank: 'TBD',
        oneCount: 'TBD',
        totalClicks: 'TBD',
        totalLast24h: 'TBD',
        totalPrevious24h: 'TBD',
        average7days: 'TBD',
        totalLast7days: 'TBD',
      }],
  
      last24HourSummary: [{
        avgRank: 'TBD',
        oneCount: 'TBD',
        totalClicks: 'TBD',
        totalLast24h: 'TBD',
        totalPrevious24h: 'TBD',
        average7days: 'TBD',
        totalLast7days: 'TBD',
      }],
      showedGraphData: {
        string: "Loading..",
      },
      graphStartDate: null,
      graphEndDate: null,
    });
  }

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
      toISOString(this.state.startDate);

    urlSearch +=
      this.state.dateRange == true
        ? "&endDate=" + toISOString(this.state.endDate)
        : "";

    this.props.history.push({
      pathname: "/admin/query",
      search: urlSearch,
    });

    this.resetInformation()

    queryGraph(
      this.state.string, 
      this.state.startDate, 
      this.state.dateRange == true ? this.state.endDate : null)
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

    getQuerySummary(
      this.state.string,
      this.state.startDate,
      this.state.dateRange == true ? this.state.endDate : null
    )
      .then((res) => res.json())
      .then(
        (res) => this.setState({ querySummary: res }),
                 this.setState({ showSummaries: true })
      );

    getQuerySummary(
      this.state.string,
      this.state.today,
    )
      .then((res) => res.json())
      .then(
        (res) => this.setState({ last24HourSummary: res })
      );

    getClicksRanks(
      this.state.string,
      this.state.startDate,
      this.state.dateRange == true ? this.state.endDate : null
    )
      .then((res) => res.json())
      .then(
        (res) => this.setState({ clickRank: res }),
        this.setState({ showClickRank: true })
      );
    getUnsuccessfulSessions(
      this.state.string,
      this.state.startDate,
      this.state.dateRange == true ? this.state.endDate : null
    )
      .then((res) => res.json())
      .then((res) => this.setState({ unsuccessfulSessions: res["n"] }));
  };

  render() {
    return (
      <div> 
        <Helmet>
          <title>{this.state.calculatedString !== null ? this.state.calculatedString + " - Query" : "Query" }</title>
        </Helmet>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              border: "1px solid grey",
              padding: 20
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
                flexDirection: "row",
                justifyContent: "start",
                marginLeft: 20
              }}
            >
              <TimePicker
                selectedDate={this.state.startDate}
                onChange={this.changeStartDate}
                label={this.state.dateRange === true ? "Start date" : "Date"}
                style = {{}}
              />
              {this.state.dateRange === true ? (
              <TimePicker
                selectedDate={this.state.endDate}
                onChange={this.changeEndDate}
                label="End date"
                margin="20px"
              />
            ) : null}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.dateRange}
                    onChange={this.handleCheckbox}
                    style={{ color: "#2c3e50", marginLeft: 20 }}
                    name="checkbox"
                  />
                }
                label="Date range"
                style={{ marginTop: "auto", marginBottom: "auto" }}
              />
            </div>
            <Button color="custom" onClick={() => this.submitEvaluation()}>
              Submit
            </Button>
          </div>

          <div style={{ marginTop: 20 }}>
            <h3 style={{ marginBottom: 20 }}>
              {this.state.calculatedString !== null ? 
                this.state.calculatedString : null}
            </h3>
            <GridContainer>
            {this.state.showGraph === true ? (
              <GridItem
                xs={12}
                lg={6}
              >
                
                  <div style={{ backgroundColor: this.state.showGraph === true ? "#E8E8E8": "inherit" }}>
                    <Chart
                      title = "Searches per day"
                      string={this.state.showedGraphData["string"]}
                      labels={this.state.showedGraphData["dates"]}
                      data={this.state.showedGraphData["clicks"]}
                      smaller = {false}
                      yLabel = "Searches"
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
              </GridItem>
              ) : null}
              {this.state.showSummaries === true ? 
              <GridItem
                xs={12}
                lg={6}
              >
                <List
                  title = "Query summary"
                  rangeInfo = {this.state.querySummary[0]}
                  last24hInfo = {this.state.last24HourSummary[0]}
                /> 
              </GridItem> : null}
              {this.state.showClickRank === true ? (
                <GridItem
                  xs={12}
                  lg={4}
                  style = {{marginTop: 20}}
                >
                  <Table2
                    tableTitle={
                      "Clicked positions"
                    }
                    tableHeaderColor="gray"
                    tableHead={["Rank", "Clicks", "%", ""]}
                    tableData={this.state.clickRank}
                    onClick={this.submitPagesPerRank}
                  />
                  <h6 style={{ marginTop: 10 }}>
                    Sessions without a click: {this.state.unsuccessfulSessions}{" "}
                  </h6>
                </GridItem>
              ) : null}
              <GridItem 
                  xs={12}
                  lg={4}
                  style = {{marginTop: 20}}
              >
                {this.state.showPagesPerRank === true ? (
                  <Table
                    percentage={true}
                    tableTitle={
                      "Results on position " + this.state.calculatedRank
                    }
                    tableHeaderColor="gray"
                    tableHead={["#", "Id", "Clicks", "%", "", ""]}
                    tableData={this.state.pagesPerRank}
                    firstColumn={["partialUrl"]}
                    secondColumn={["n"]}
                    localLinkPath="localUrl"
                    localLinkAditionalInfo={
                      "&startDate=" + toISOString(this.state.calculatedStartDate) + 
                      (this.state.calculatedEndDate !== null ? "&endDate=" + toISOString(this.state.calculatedEndDate) : "")
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
      </div>
    );
  }
}

export default QueryAnalysis;
