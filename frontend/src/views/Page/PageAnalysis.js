import React, { Component } from "react";
import { Helmet } from 'react-helmet';

// core components
import TextRotationNoneIcon from "@material-ui/icons/TextRotationNone";
import ZzIcon from "../../assets/img/logo.png";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import IconButton from "@material-ui/core/IconButton";

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
    today: new Date(),

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

    stringsPerRank: null,
  };

  componentDidMount() {

    let startToday = new Date();
    startToday.setHours(0);
    startToday.setMinutes(0);  

    let endToday = new Date();
    endToday.setHours(23);
    endToday.setMinutes(59);
    
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
        startDate: startDate != null ? new Date(startDate) : startToday,
        endDate: endDate != null ? new Date(endDate) : endToday,
      },
      () => {
        if (tp_item != null && fk_item != null && startDate != null && endDate != null)
          this.submitEvaluation(this.state.startDate, this.state.endDate);
      }
    );
  }

  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage });
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: parseInt(event.target.value, 10), page: 0 });
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

  resetInformation (startDate, endDate) {
    this.setState({
      tableData: [
        {
          page_number: 1,
          mysql_id: 0,
          n: "Loading...",
        },
      ],
      pageSummary: [{
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
      showGraph: false,
      pageLink: "",
      showPagesRank: false,
      calculatedTp_Item: this.state.tp_item,
      calculatedFk_Item: this.state.fk_item,
      calculatedStartDate: startDate,
      calculatedEndDate: endDate,
      showStringsPerRank: false
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
      showStringsPerRank: false
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

  submitEvaluation(startDate, endDate) {

    if(this.state.tp_item == "" || this.state.fk_item == "")
      return

    let urlSearch =
      "?tp_item=" +
      this.state.tp_item +
      "&fk_item=" +
      this.state.fk_item +
      "&startDate=" +
      toISOString(startDate) +
      "&endDate=" + 
      toISOString(endDate);

    this.props.history.push({
      pathname: "/page",
      search: urlSearch,
    });

    this.resetInformation(startDate, endDate)

    pageGraph(this.state.tp_item, 
              this.state.fk_item, 
              startDate, 
              endDate
              )
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
      startDate,
      endDate
    )
      .then((res) => res.json())
      .then(
        (res) => this.setState({ pageSummary: res.length !== 0 ? res : [{
          total7daysAgo: 0,
          avgRank: 0,
          oneCount: 0,
          totalClicks: 0,
          totalLast24h: 0,
          totalPrevious24h: 0,
          average7days: 0,
          totalLast7days: 0,
        }] }),
                 this.setState({ showSummaries: true })
      );

    let startToday = new Date()
    startToday.setHours(0)
    startToday.setMinutes(0)
    startToday.setSeconds(0)    

    let endToday = new Date()
    endToday.setHours(23)
    endToday.setMinutes(59)
    endToday.setSeconds(59)

    getPageSummary(
      this.state.tp_item,
      this.state.fk_item,
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

    getPagesRank(
      this.state.tp_item,
      this.state.fk_item,
      startDate,
      endDate
    )
      .then((res) => res.json())
      .then(
        (res) =>(
          res["rank"].length !== 0 && this.submitStringsPerRank(res["rank"][0]["page_number"], res["rank"][0]["mysql_id"]),
          this.setState({ tableData: res["rank"], pageLink: res["link"] }),
          this.setState({ showPagesRank: true })),
      );

  };

  render() {
    return (
      <div>
        <Helmet>
          <title>{this.state.pageLink !== "" ? this.state.pageLink.replace("https://www.zerozero.pt/","") + " - Page" : "Page" }</title>
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
            <Dropdown
              list={this.state.entityTypes}
              name="Entity type"
              value={this.state.tp_item}
              onChange={this.changeTpItem}
            />
            <label
              style={{ marginLeft: 20, marginTop: "auto", marginBottom: "auto" }}
            >
              Id:
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
            <Button 
              color="custom" 
              onClick={() => this.submitEvaluation(this.state.startDate, this.state.endDate)}>
              Submit
            </Button>
          </div>

          <div style={{ marginTop: 20 }}>
          {this.state.pageLink !== "" ?
            <div style = {{
              display: "flex",
              flexDirection: "row",
              marginBottom: 20
              }}>
              <h3 style={{ marginTop: "auto", marginBottom: "auto" }}>
                {this.state.pageLink.replace("https://www.zerozero.pt/","")} 
              </h3>
              <IconButton
                color="primary"
                component="span"
                onClick={() => window.open(this.state.pageLink)}
                style={{marginLeft: 10}}
              >
                <img width="35" src={ZzIcon} />
              </IconButton>
            </div> : null}
            <GridContainer>
              {this.state.showGraph === true ? (
              <GridItem
                xs={12}
                lg={6}
              >  
                  <div style={{ backgroundColor: this.state.showGraph === true ? "#E8E8E8": "inherit" }}>
                    <Chart
                      title = "Accesses per day"
                      string={this.state.pageLink.replace("https://www.zerozero.pt/","")}
                      labels={this.state.showedGraphData["dates"]}
                      data={this.state.showedGraphData["clicks"]}
                      smaller = {false}
                      yLabel = "Clicks"
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
                lg={6}
              >
                <List
                  title = "Page summary"
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
                    tableTitle={"Clicked positions"}
                    tableHeaderColor="gray"
                    tableHead={["Rank", "Clicks", "%", ""]}
                    tableData={this.state.tableData}
                    onClick={this.submitStringsPerRank}
                  />
                ) : null}
              </GridItem>
              <GridItem xs={12} sm={12} md={2} style={{marginTop: 20}}>
                {this.state.showStringsPerRank === true ? (
                  <ExpandableTable
                    tableTitle={
                      "Queries searched on position " + this.state.calculatedRank
                    }
                    tableHeaderColor="gray"
                    tableHead={["#", "Query", "Searches", "%",""]}
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
      </div>
    );
  }
}

export default PageAnalysis;
