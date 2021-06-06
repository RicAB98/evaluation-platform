import React, { Component } from "react";
import { Helmet } from 'react-helmet';

// core components
import MenuBookIcon from "@material-ui/icons/MenuBook";
import ZzIcon from "../../assets/img/logo.png";
import ButtonGroup from "@material-ui/core/ButtonGroup";


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
    today: new Date(),
    calculatedStartDate: null,
    calculatedEndDate: null,

    string: "",

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
    let endToday = new Date();
    endToday.setHours(23);
    endToday.setMinutes(59);

    let search = window.location.search;
    let params = new URLSearchParams(search);

    let string = params.get("search_string");
    let startDate = params.get("startDate");
    let endDate = params.get("endDate");

    this.setState({
      string: string != null ? string : "",
      startDate: startDate != null ? new Date(startDate) : new Date(),
      endDate: endDate != null ? new Date(endDate) : endToday,
    },
    () => {if(string != null && startDate != null && endDate !== null)
            this.submitEvaluation(this.state.startDate, this.state.endDate);
    });
  }

  changeValue = (event) => {
    this.setState({ string: event.target.value });
  };

  changeStartDate = (event) => {
    this.setState({ startDate: new Date(event.target.value) });
  };

  changeEndDate = (event) => {
    this.setState({ endDate: new Date(event.target.value) });
  };

  last30min() {
    let endDate = new Date();
    let startDate = new Date(endDate - 60000 * 30)

    this.submitEvaluation(startDate, endDate)
  }

  last60min() {
    let endDate = new Date();
    let startDate = new Date(endDate - 60000 * 60)

    this.submitEvaluation(startDate, endDate)
  }

  last24hours() {
    let endDate = new Date();
    let startDate = new Date(endDate - 60000 * 60 * 24)

    this.submitEvaluation(startDate, endDate)
  }
  
  changeGraphStartDate = (newDate) => {
    let formatedDate =
      newDate.getFullYear() +
      "-" +
      addOne(newDate.getMonth()) +
      "-" +
      newDate.getDate();

    if (newDate > this.state.graphEndDate) return;

    this.setState({ graphStartDate: newDate });
    this.changeGraphRange(newDate, this.state.graphEndDate);
  };

  changeGraphEndDate = (newDate) => {
    let formatedDate =
      newDate.getFullYear() +
      "-" +
      addOne(newDate.getMonth()) +
      "-" +
      newDate.getDate();

    if (newDate < this.state.graphStartDate) return;

    this.setState({ graphEndDate: newDate });
    this.changeGraphRange(this.state.graphStartDate, newDate);
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

      console.log(formatedStartDate)
      console.log(formatedEndDate)

    console.log(dates.indexOf(formatedStartDate))
    console.log(dates.indexOf(formatedEndDate))

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

  resetInformation(startDate, endDate)
  {
    this.setState({
      calculatedString: this.state.string,
      calculatedStartDate: startDate,
      calculatedEndDate: endDate,
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
        total7daysAgo: 'TBD',
        avgRank: 'TBD',
        oneCount: 'TBD',
        totalClicks: 'TBD',
        totalLast24h: 'TBD',
        totalPrevious24h: 'TBD',
        average7days: 'TBD',
        totalLast7days: 'TBD',
      }],
  
      last24HourSummary: [{
        total7daysAgo: 'TBD',
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

  submitEvaluation(startDate, endDate) {

    if(this.state.string == "")
      return

    let urlSearch =
      "?search_string=" +
      this.state.string +
      "&startDate=" +
      toISOString(startDate) +
      "&endDate=" + 
      toISOString(endDate);

    this.props.history.push({
      pathname: "/query",
      search: urlSearch,
    });

    this.resetInformation(startDate, endDate)

    queryGraph(
      this.state.string, 
      startDate, 
      endDate)
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
      startDate,
      endDate
    )
      .then((res) => res.json())
      .then(
        (res) => 
        (this.setState({ querySummary: res.length !== 0 ? res : [{
          total7daysAgo: 0,
          avgRank: 0,
          oneCount: 0,
          totalClicks: 0,
          totalLast24h: 0,
          totalPrevious24h: 0,
          average7days: 0,
          totalLast7days: 0,
        }] }),
        this.setState({ showSummaries: true }))
      );

    let startToday = new Date()
    startToday.setHours(0)
    startToday.setMinutes(0)
    startToday.setSeconds(0)    

    let endToday = new Date()
    endToday.setHours(23)
    endToday.setMinutes(59)
    endToday.setSeconds(59)

    getQuerySummary(
      this.state.string,
      startToday,
      endToday     
    )
      .then((res) => res.json())
      .then(
        (res) => this.setState({ last24HourSummary: res.length !== 0 ? res : [{
          total7daysAgo: 0,
          avgRank: 0,
          oneCount: 0,
          totalClicks: 0,
          totalLast24h: 0,
          totalPrevious24h: 0,
          average7days: 0,
          totalLast7days: 0,
        }] })
      );

    getClicksRanks(
      this.state.string,
      startDate,
      endDate
    )
      .then((res) => res.json())
      .then(
        (res) => (
          res.length !== 0 && this.submitPagesPerRank(res[0]["page_number"], res[0]["mysql_id"]),
          this.setState({ clickRank: res }),
          this.setState({ showClickRank: true })
        ) 
      );

    getUnsuccessfulSessions(
      this.state.string,
      startDate,
      endDate
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
                label={"Start date"}
                style = {{}}
              />
              <TimePicker
                selectedDate={this.state.endDate}
                onChange={this.changeEndDate}
                label="End date"
                margin="20px"
              />
              <ButtonGroup
                aria-label="vertical outlined primary button group"
              >
                <Button
                  onClick={() => this.last30min()}
                  style={{
                    color: "#2c3e50",
                    backgroundColor: "white",
                    border: "1px solid #2c3e50",
                    textTransform: "capitalize",
                  }}
                >
                  Last 30 min
                </Button>
                <Button
                  onClick={() => this.last60min()}
                  style={{
                    color: "#2c3e50",
                    backgroundColor: "white",
                    border: "1px solid #2c3e50",
                    textTransform: "capitalize",
                  }}
                >
                  Last 60 min
                </Button>
                <Button
                  onClick={() => this.last24hours()}
                  style={{
                    color: "#2c3e50",
                    backgroundColor: "white",
                    border: "1px solid #2c3e50",
                    textTransform: "capitalize",
                  }}
                >
                  Last 24 hours
                </Button>
              </ButtonGroup>
            </div>
            <Button color="custom" onClick={() => this.submitEvaluation(this.state.startDate, this.state.endDate)}>
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
                    columnWidth={["10%","40%","20%","25%","10%","5%"]}
                    columnTextAlign={["start","start","end", "end","center","center"]}
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
