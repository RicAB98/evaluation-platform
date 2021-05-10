import React, { Component } from "react";

// core components
import TextRotationNoneIcon from "@material-ui/icons/TextRotationNone";
import ZzIcon from "../../assets/img/logo.png";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import Calendar from "../../components/Calendar/Calendar.js";
import Chart from "../../components/Chart/Chart";
import Button from "../../components/Button/Button.js";
import ExpandableTable from "../../components/Table/ExpandableTable";
import Dropdown from "../../components/Dropdown/Dropdown.js";
import Table2 from "../../components/Table/Table2.js";
import TimePicker from "../../components/Calendar/TimePicker.js";
import List from "../../components/List/List";

import { getPagesRank, pageGraph, getPageSummary, getStringsPerRank } from "../../requests/requests.js";
import { toISOString, addOne } from "../../utils/utils.js"

class PageAnalysis extends Component {
  state = {
    entityTypes: [
      { id: 2, name: "Competition" },
      { id: 3, name: "Team" },
      { id: 4, name: "Player" },
      { id: 8, name: "Stadium" },
      { id: 9, name: "Coach" },
      { id: 10, name: "City" },
      { id: 13, name: "Referee" },
      { id: 16, name: "Director" },
      { id: 17, name: "Agent" },
      { id: 18, name: "Menu" },
    ],
    tp_item: "",
    fk_item: "",

    startDate: new Date(),
    endDate: new Date(),
    today: new Date("2021-01-23"),

    dateRange: false,

    showGraph: false,
    graphStartDate: null,
    graphEndDate: null,

    calculatedTp_Item: 0,
    calculatedFk_Item: 0,
    calculatedStartDate: null,
    calculatedEndDate: null,

    calculatedRank: null,
    showSummaries: false,
    showPagesRank: false,
    showStringsPerRank: false,

    pageLink: "",

    page: 0,
    rowsPerPage: 10,

    graphData: {
      string: "Loading..",
    },

    showedGraphData: {
      string: "Loading..",
    },

    tableData: [
      {
        page_number: 1,
        mysql_id: 0,
        n: "Loading...",
      },
    ],

    pageSummary: [{
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

    stringsPerRank: null,
  };

  componentDidMount() {
    let search = window.location.search;
    let params = new URLSearchParams(search);

    let tp_item = params.get("tp_item");
    let fk_item = params.get("fk_item");
    let startDate = params.get("startDate");
    let endDate = params.get("endDate");

    this.setState(
      {
        tp_item: tp_item != null ? tp_item : "",
        fk_item: fk_item != null ? fk_item : "",
        startDate: startDate != null ? new Date(startDate) : new Date(),
        endDate: endDate != null ? new Date(endDate) : new Date(),
        dateRange: endDate != null ? true : false,
      },
      () => {
        if (tp_item != null && fk_item != null && startDate != null)
          this.submitEvaluation();
      }
    );
  }

  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage });
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: parseInt(event.target.value, 10), page: 0 });
  };

  handleCheckbox = (event) => {
    this.setState({ dateRange: event.target.checked });
    console.log( new Date (this.state.startDate + 60000))
  };

  changeValue = (event) => {
    this.setState({ [event.target.id]: event.target.value });
  };

  changeTpItem = (event) => {
    this.setState({ tp_item: event.target.value });
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

  resetInformation () {
    this.setState({
      tableData: [
        {
          page_number: 1,
          mysql_id: 0,
          n: "Loading...",
        },
      ],
      pageSummary: [{
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
      showGraph: false,
      pageLink: "",
      showPagesRank: false,
      calculatedTp_Item: this.state.tp_item,
      calculatedFk_Item: this.state.fk_item,
      calculatedStartDate: this.state.startDate,
      calculatedEndDate:
        this.state.dateRange == true ? this.state.endDate : null,
    });
  }

  submitStringsPerRank = (page, mysql_id) => {
    let calculatedRank = page === "20+" ? "20+" : 10 * (page - 1) + mysql_id;

    this.setState({
      calculatedRank: calculatedRank,
      stringsPerRank: [
        {
          page: "Loading...",
          mysql_id: "Loading...",
          n: "Loading...",
        },
      ],
    });

    getStringsPerRank(
      page,
      mysql_id,
      this.state.calculatedTp_Item,
      this.state.calculatedFk_Item,
      this.state.calculatedStartDate,
      this.state.calculatedEndDate
    )
      .then((res) => res.json())
      .then(
        (res) => this.setState({ stringsPerRank: res }),
        this.setState({ showStringsPerRank: true })
      );
  };

  submitEvaluation = () => {
    let urlSearch =
      "?tp_item=" +
      this.state.tp_item +
      "&fk_item=" +
      this.state.fk_item +
      "&startDate=" +
      toISOString(this.state.startDate);

    urlSearch +=
      this.state.dateRange == true
        ? "&endDate=" + toISOString(this.state.endDate)
        : "";

    this.props.history.push({
      pathname: "/admin/page",
      search: urlSearch,
    });

    this.resetInformation()

    if (this.state.dateRange == true)
      pageGraph(this.state.tp_item, 
                this.state.fk_item, 
                this.state.startDate, 
                this.state.endDate)
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

    getPageSummary(
      this.state.tp_item,
      this.state.fk_item,
      this.state.startDate,
      this.state.dateRange == true ? this.state.endDate : null
    )
      .then((res) => res.json())
      .then(
        (res) => this.setState({ pageSummary: res}),
                 this.setState({ showSummaries: true })
      );

    getPageSummary(
      this.state.tp_item,
      this.state.fk_item,
      this.state.today
    )
      .then((res) => res.json())
      .then(
        (res) => this.setState({ last24HourSummary: res})
      );

    getPagesRank(
      this.state.tp_item,
      this.state.fk_item,
      this.state.startDate,
      this.state.dateRange == true ? this.state.endDate : null
    )
      .then((res) => res.json())
      .then(
        (res) =>
          this.setState({ tableData: res["rank"], pageLink: res["link"] }),
          this.setState({ showPagesRank: true })
      );
  };

  render() {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            border: "1px solid grey",
            padding: 20
          }}
        >
          <Dropdown
            list={this.state.entityTypes}
            name="Tp_item"
            value={this.state.tp_item}
            onChange={this.changeTpItem}
          />
          <label
            style={{ marginLeft: 20, marginTop: "auto", marginBottom: "auto" }}
          >
            Fk_item:
            <input
              value={this.state.fk_item}
              onChange={this.changeValue}
              id="fk_item"
              type="text"
              style={{
                marginLeft: 8,
                marginTop: "auto",
                marginBottom: "auto",
                width: 110,
              }}
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
          <Button
            color="custom"
            onClick={() =>
              this.submitEvaluation(this.state.tp_item, this.state.fk_item)
            }
          >
            Submit
          </Button>
        </div>

        <div style={{ marginTop: 20 }}>
          <GridContainer>
            {this.state.showGraph === true ? (
            <GridItem
              xs={12}
              lg={6}
            >  
                <div style={{ backgroundColor: this.state.showGraph === true ? "#E8E8E8": "inherit" }}>
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
            </GridItem>
            ) : null}
            { this.state.showSummaries ?
            <GridItem
              xs={12}
              lg={this.state.showGraph === true ? 6 : 12}
            >
              <List
                rangeInfo = {this.state.pageSummary[0]}
                last24hInfo = {this.state.last24HourSummary[0]}
              />
            </GridItem> : null}
            <GridItem
              xs={12}
              lg={4}
              style={{marginTop: 20}}
            >
              {this.state.showPagesRank === true ? (
                <Table2
                  tableTitle={"Page's ranks"}
                  tableHeaderColor="gray"
                  tableHead={["Rank", "Clicks", "%", ""]}
                  headerLinkIcon={
                    this.state.pageLink != "" ? (
                      <img width="35" src={ZzIcon} />
                    ) : (
                      ""
                    )
                  }
                  headerLinkPath={this.state.pageLink}
                  tableData={this.state.tableData}
                  onClick={this.submitStringsPerRank}
                />
              ) : null}
            </GridItem>
            <GridItem xs={12} sm={12} md={2} style={{marginTop: 30}}>
              {this.state.showStringsPerRank === true ? (
                <ExpandableTable
                  tableTitle={
                    "Searched strings for rank " + this.state.calculatedRank
                  }
                  tableHeaderColor="gray"
                  tableHead={["#", "Query", "Count", "",""]}
                  tableData={this.state.stringsPerRank}
                  firstColumn={["search_string"]}
                  secondColumn={["n"]}
                  localLinkPath="localLink"
                  localLinkAditionalInfo={
                    "&startDate=" +
                    toISOString(this.state.calculatedStartDate) +
                    (this.state.calculatedEndDate !== null
                      ? "&endDate=" +
                        toISOString(this.state.calculatedEndDate)
                      : "")
                  }
                  localLinkIcon={<TextRotationNoneIcon />}
                  externalLink={false}
                  page={this.state.page}
                  rowsPerPage={this.state.rowsPerPage}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
              ) : null}
            </GridItem>
          </GridContainer>
        </div>
      </div>
    );
  }
}

export default PageAnalysis;
