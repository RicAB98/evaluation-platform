import React, { Component } from "react";

// core components
import LinkIcon from "@material-ui/icons/Link";
import MenuBookIcon from "@material-ui/icons/MenuBook";

import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import Button from "../../components/Button/Button.js";
import Table from "../../components/Table/Table.js";
import Table2 from "../../components/Table/Table2.js";
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
    startDate: new Date("2021-01-29"),
    endDate: null,

    string:"",

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
    
    if (string !== null)
      this.setState({ string: string }, () => this.submitEvaluation());     
  }

  changeValue = (event) => {
    this.setState({ string: event.target.value });
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

    getPagesPerRank(page, mysql_id, this.state.calculatedString)
      .then((res) => res.json())
      .then(
        (res) => this.setState({ pagesPerRank: res }),
        this.setState({ showPagesPerRank: true })
      );
  };

  submitEvaluation = () => {
    this.props.history.push({
      pathname: "/admin/query",
      search: "?search_string=" + this.state.string,
    });

    this.setState({ calculatedString: this.state.string });
    this.setState({ showPagesPerRank: false });
    this.setState({ unsuccessfulSessions: "" });

    this.setState({
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

    queryGraph(this.state.string)
      .then((res) => res.json())
      .then((res) =>
        this.setState({
          showGraph: true,
          graphData: res,
          showedGraphData: res,
          graphStartDate: new Date(res["dates"][0]),
          graphEndDate: new Date(res["dates"][res["dates"].length - 1]),
        })
      );
    getClicksRanks(this.state.string)
      .then((res) => res.json())
      .then(
        (res) => this.setState({ clickRank: res }),
        this.setState({ showClickRank: true })
      );
    getUnsuccessfulSessions(this.state.string)
      .then((res) => res.json())
      .then((res) => this.setState({ unsuccessfulSessions: res["n"] }));
  };

  changeStartDate = (newDate) => {
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

  changeEndDate = (newDate) => {
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
            width: 400,
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
            >
              {this.state.showGraph === true ? (
                <div>
                  <Chart
                    string={this.state.showedGraphData["string"]}
                    labels={this.state.showedGraphData["dates"]}
                    data={this.state.showedGraphData["clicks"]}
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
                      onChange={this.changeStartDate}
                      label="Start date"
                    />
                    <Calendar
                      id="endDate"
                      selectedDate={this.state.graphEndDate}
                      onChange={this.changeEndDate}
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
                  firstColumn={["tp_item", "fk_item"]}
                  secondColumn={["n"]}
                  localLinkPath="/admin/page?"
                  localLinkIcon={<MenuBookIcon />}
                  externalLink={true}
                  externalLinkPath="link"
                  externalLinkIcon={<LinkIcon />}
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
