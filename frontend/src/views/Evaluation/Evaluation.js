import React, { Component } from "react";
import { Helmet } from 'react-helmet';

import { withStyles } from "@material-ui/core/styles";

// core components
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextRotationNoneIcon from "@material-ui/icons/TextRotationNone";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import ZzIcon from "../../assets/img/logo.png";
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Switch from "@material-ui/core/Switch";

import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import Button from "../../components/Button/Button.js";
import Table from "../../components/Table/Table.js";
import Calendar from "../../components/Calendar/TimePicker.js";
import BarChart from "../../components/Chart/BarChart.js";

import { runEvaluation } from "../../requests/requests.js";
import { toISOString } from "../../utils/utils.js"

const CustomSwitch = withStyles({
  switchBase: {
    color: "#2c3e50",
    "&$checked": {
      color: "#2c3e50",
    },
    "&$checked + $track": {
      backgroundColor: "#2c3e50",
    },
  },
  checked: {},
  track: {},
})(Switch);

class Evaluation extends Component {
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
    popularPages: [
      {
        tp_item: 0,
        fk_item: 0,
        n: "Loading...",
      },
    ],
    startDate: new Date(),
    endDate: new Date(),
    calculatedStartDate: null,
    calculatedEndDate: null,
    viewTables: false,
  };

  componentDidMount() {
    let endToday = new Date();
    endToday.setHours(23);
    endToday.setMinutes(59);

    let search = window.location.search;
    let params = new URLSearchParams(search);

    let startDate = params.get("startDate");
    let endDate = params.get("endDate");

    this.setState(
      {
        startDate: startDate !== null ? new Date(startDate) : new Date(),
        endDate: endDate != null ? new Date(endDate) : endToday,
      },
      () => {
        if (startDate !== null && endDate !== null)
          this.submitEvaluation(this.state.startDate, this.state.endDate);
      }
    );
  }

  handleChangeView = (event) => {
    this.setState({ viewTables: event.target.checked });
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

  toRegularDateFormat(date) {
    return date != null ? date.replace("T", " ") : null;
  }

  resetInformation(startDate, endDate)
  {
    this.setState({
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
      popularPages: [
        {
          tp_item: 0,
          fk_item: 0,
          n: "Loading...",
        },
      ], 
      calculatedStartDate: startDate,
      calculatedEndDate: endDate, 
      showTables: true });
  }

  submitEvaluation(startDate, endDate) {

    console.log(startDate)
    console.log(endDate)


    let urlSearch =
      "?startDate=" +
      toISOString(startDate) + 
      "&endDate=" + 
      toISOString(endDate);

    this.props.history.push({
      pathname: "/evaluation",
      search: urlSearch
    });

    this.resetInformation(startDate, endDate)

    runEvaluation(startDate, endDate )
      .then((res) => res.json())
      .then((res) =>
        this.setState({
          popularQueries: res["popularQueries"],
          unsuccessfulQueries: res["unsuccessfulQueries"],
          popularPages: res["popularPages"],
        })
      );
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>{ "Evaluation" }</title>
        </Helmet>
        <div style={{ marginLeft: 16, marginRight: 16 }} >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              border: "1px solid grey",
              padding: 20
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "start",
              }}
            >
              <Calendar
                selectedDate={this.state.startDate}
                onChange={this.changeStartDate}
                label={"Start date"}
              />
              <Calendar
                selectedDate={this.state.endDate}
                onChange={this.changeEndDate}
                label="End date"
                margin="20px"
              /> 
            </div>
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
            <Button
              color="custom"
              onClick={() =>
                this.submitEvaluation(this.state.startDate, this.state.endDate)
              }
            >
              Submit
            </Button>
            <FormControlLabel
              style={{ marginLeft: 10 }}
              control={
                <CustomSwitch
                  checked={this.state.viewTables}
                  onChange={this.handleChangeView}
                  style={{ color: "#2c3e50" }}
                />
              }
              label="Show tables"
            />
          </div>
          {this.state.showTables === true ? (
            <div>
              <h3 style={{ marginTop: 20 }}>
                {this.state.calculatedEndDate !== null ? 
                  this.toRegularDateFormat(toISOString(this.state.calculatedStartDate)) 
                  : this.toRegularDateFormat(toISOString(this.state.calculatedStartDate)).substring(0,10)  }
                {this.state.calculatedEndDate !== null ?
                  "   -   " + this.toRegularDateFormat(toISOString(this.state.calculatedEndDate))
                : null}
              </h3>
              {this.state.viewTables === true ? (
                <GridContainer spacing={2}>
                  <GridItem xs={12} sm={12} xl={3}>
                    <Table
                      tableTitle="Popular queries"
                      tableHeaderColor="gray"
                      tableHead={["#", "Query", "Searches", ""]}
                      columnWidth={["10%","40%","35%","10%"]}
                      columnTextAlign={["start","start","end", "center"]}
                      headerLinkIcon={<FormatListNumberedIcon />}
                      headerLinkPath={
                        "fullresults?type=1&startDate=" +
                        toISOString(this.state.calculatedStartDate) +
                        (this.state.calculatedEndDate !== null
                          ? "&endDate=" +
                            toISOString(this.state.calculatedEndDate)
                          : "")
                      }
                      localLinkAditionalInfo={
                        "&startDate=" +
                        toISOString(this.state.calculatedStartDate) +
                        (this.state.calculatedEndDate !== null
                          ? "&endDate=" +
                            toISOString(this.state.calculatedEndDate)
                          : "")
                      }
                      tableData={this.state.popularQueries}
                      firstColumn={["search_string"]}
                      secondColumn={["n"]}
                      localLinkPath="url"
                      localLinkIcon={<TextRotationNoneIcon />}
                      externalLink={false}
                    />
                  </GridItem>
                  <GridItem
                    xs={12}
                    sm={12}
                    xl={8}
                    style={{ marginTop: 20, marginLeft: 10 }}
                  >
                    <BarChart
                      title="Popular queries"
                      data={this.state.popularQueries}
                      xVariable="search_string"
                      yVariable="n"
                      yLabel="Queries"
                      page={-1}
                    />
                  </GridItem>

                  <GridItem xs={12} sm={12} xl={3} style={{ marginTop: 20 }}>
                    <Table
                      tableTitle="Unsuccessful queries"
                      tableHeaderColor="gray"
                      tableHead={["#", "Query", "Searches", ""]}
                      columnWidth={["10%","40%","35%","10%"]}
                      columnTextAlign={["start","start","end", "center"]}
                      headerLinkIcon={<FormatListNumberedIcon />}
                      headerLinkPath={
                        "fullresults?type=2&startDate=" +
                        toISOString(this.state.calculatedStartDate) +
                        (this.state.calculatedEndDate !== null
                          ? "&endDate=" +
                            toISOString(this.state.calculatedEndDate)
                          : "")
                      }
                      tableData={this.state.unsuccessfulQueries}
                      firstColumn={["search_string"]}
                      secondColumn={["n"]}
                      localLinkPath="url"
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
                    />
                  </GridItem>
                  <GridItem
                    xs={12}
                    sm={12}
                    xl={8}
                    style={{ marginTop: 40, marginLeft: 10 }}
                  >
                    <BarChart
                      title="Unsuccessful queries"
                      data={this.state.unsuccessfulQueries}
                      xVariable="search_string"
                      yVariable="n"
                      yLabel="Queries"
                      page={-1}
                    />
                  </GridItem>

                  <GridItem xs={12} sm={12} xl={3} style={{ marginTop: 20 }}>
                    <Table
                      tableTitle="Popular pages"
                      tableHeaderColor="gray"
                      tableHead={["#", "Id", "Clicks", "", ""]}
                      columnWidth={["10%","45%","30%","10%","5%"]}
                      columnTextAlign={["start","start","end", "center","center"]}
                      headerLinkIcon={<FormatListNumberedIcon />}
                      headerLinkPath={
                        "fullresults?type=3&startDate=" +
                        toISOString(this.state.calculatedStartDate) +
                        (this.state.calculatedEndDate !== null
                          ? "&endDate=" +
                            toISOString(this.state.calculatedEndDate)
                          : "")
                      }
                      tableData={this.state.popularPages}
                      firstColumn={["partialUrl"]}
                      secondColumn={["n"]}
                      localLinkPath="localUrl"
                      localLinkAditionalInfo={
                        "&startDate=" +
                        toISOString(this.state.calculatedStartDate) +
                        (this.state.calculatedEndDate !== null
                          ? "&endDate=" +
                            toISOString(this.state.calculatedEndDate)
                          : "")
                      }
                      localLinkIcon={<MenuBookIcon />}
                      externalLink={true}
                      externalLinkPath="fullUrl"
                      externalLinkIcon={<img width="25" src={ZzIcon} />}
                    />
                  </GridItem>
                  <GridItem
                    xs={12}
                    sm={12}
                    xl={8}
                    style={{ marginTop: 40, marginLeft: 10 }}
                  >
                    <BarChart
                      title="Popular pages"
                      data={this.state.popularPages}
                      xVariable="partialUrl"
                      yVariable="n"
                      yLabel="Pages"
                      page={-1}
                    />
                  </GridItem>
                </GridContainer>
              ) : (
                <GridContainer spacing={0}>
                  <GridItem md={12} lg={6} style = {{marginTop: 20}}>
                    <h5 style = {{ marginTop: "auto", marginBottom: "auto"}}> Popular queries </h5>
                    <BarChart
                      data={this.state.popularQueries}
                      xVariable="search_string"
                      yVariable="n"
                      yLabel="Queries"
                      page={-1}
                    />
                  </GridItem>
                  <GridItem md={12} lg={6} style = {{marginTop: 20}}>
                    <h5 style = {{ marginTop: "auto", marginBottom: "auto"}}> Popular pages </h5>
                    <BarChart
                      data={this.state.popularPages}
                      xVariable="partialUrl"
                      yVariable="n"
                      yLabel="Pages"
                      page={-1}
                    />
                  </GridItem>
                  <GridItem md={12} lg={6} style = {{marginTop: 20}}>
                    <h5 style = {{ marginTop: "auto", marginBottom: "auto"}}> Unsuccessful queries </h5>
                    <BarChart
                      data={this.state.unsuccessfulQueries}
                      xVariable="search_string"
                      yVariable="n"
                      yLabel="Queries"
                      page={-1}
                    />
                  </GridItem>
                </GridContainer>
              )}
            </div>
          ) : null}
        </div>
      </div>

    );
  }
}

export default Evaluation;
