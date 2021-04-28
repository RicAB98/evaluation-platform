import React, { Component } from "react";
// core components
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TimelineIcon from "@material-ui/icons/Timeline";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import ZzIcon from "../../assets/img/logo.png";
import OpenWithIcon from '@material-ui/icons/OpenWith';

import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import Button from "../../components/Button/Button.js";
import Table from "../../components/Table/Table.js";
import Calendar from "../../components/Calendar/TimePicker.js";
import BarChart from "../../components/Chart/BarChart.js";

import { runEvaluation } from "../../requests/requests.js";

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
    popularPages: [
      {
        tp_item: 0,
        fk_item: 0,
        n: "Loading...",
      },
    ],
    evaluationId: -1,
    startDate: "2021-01-20T00:00",
    endDate: "",
    calculatedStartDate: null,
    calculatedEndDate: null,
    checkbox: false,
  };

  componentDidMount() {
    let endDate = new Date();
    endDate.setHours(23);
    endDate.setMinutes(59);
    this.setState({ endDate: this.toISOString(endDate) });

    //endDate = endDate.getFullYear() + "-" + endDate.getMonth() + "-" + endDate.getDate() + "T23:59"
    //this.setState({ endDate: endDate })

    /*let search = window.location.search;
    let params = new URLSearchParams(search);

    let startDate = params.get("startDate");
    let endDate = params.get("endDate"); 

    if(startDate !== null && new Date(startDate) != 'Invalid Date')
      this.setState({ startDate: new Date(startDate) }, () => {new Date(endDate) != 'Invalid Date' && this.submitEvaluation(startDate, endDate) });

    if(endDate !== null && new Date(endDate) != 'Invalid Date')
      this.setState({ endDate: new Date(endDate), checkbox: true});*/
  }

  handleCheckbox = (event) => {
    this.setState({ checkbox: event.target.checked });
  };

  toISOString(date) {
    let month =
      date.getMonth() <= 9
        ? "0" + this.addOne(date.getMonth())
        : this.addOne(date.getMonth());
    let day = date.getDate() <= 9 ? "0" + date.getDate() : date.getDate();
    let minutes =
      date.getMinutes() <= 9 ? "0" + date.getMinutes() : date.getMinutes();

    return (
      date.getFullYear() +
      "-" +
      month +
      "-" +
      day +
      "T" +
      date.getHours() +
      ":" +
      minutes
    );
  }

  toRegularDateFormat(date) {
    return date.replace("T", " ");
  }

  submitEvaluation(startDate, endDate) {
    let startDateRegularFormat = this.toRegularDateFormat(startDate);

    this.setState({ calculatedStartDate: startDateRegularFormat });
    this.setState({ showTables: true });

    if (this.state.checkbox == true) {
      let endDateRegularFormat = this.toRegularDateFormat(endDate);

      this.setState({ calculatedEndDate: endDateRegularFormat });

      this.props.history.push({
        pathname: "/admin/daily",
        search:
          "?startDate=" +
          startDateRegularFormat +
          "&endDate=" +
          endDateRegularFormat,
      });

      runEvaluation(startDateRegularFormat, endDateRegularFormat)
        .then((res) => res.json())
        .then((res) =>
          this.setState({
            evaluationId: res["id"],
            popularQueries: res["popularQueries"],
            unsuccessfulQueries: res["unsuccessfulQueries"],
            popularPages: res["popularPages"],
          })
        );
    } else {
      this.props.history.push({
        pathname: "/admin/daily",
        search: "?startDate=" + startDateRegularFormat,
      });

      this.setState({ calculatedEndDate: null });

      runEvaluation(startDateRegularFormat, null)
        .then((res) => res.json())
        .then((res) =>
          this.setState({
            evaluationId: res["id"],
            popularQueries: res["popularQueries"],
            unsuccessfulQueries: res["unsuccessfulQueries"],
            popularPages: res["popularPages"],
          })
        );
    }
  }

  changeStartDate = (event) => {
    this.setState({ startDate: event.target.value });
  };

  changeEndDate = (event) => {
    this.setState({ endDate: event.target.value });
  };

  addOne(value) {
    return value + 1;
  }

  render() {
    return (
      <div style={{ marginLeft: 16 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: 800,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "start",
            }}
          >
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
              style={{ marginTop: "auto", marginBottom: "auto" }}
            />
          </div>
          {this.state.checkbox === true ? (
            <Calendar
              selectedDate={this.state.endDate}
              onChange={this.changeEndDate}
              label="End date"
              margin="20px"
            />
          ) : null}
          <Button
            color="custom"
            onClick={() =>
              this.submitEvaluation(this.state.startDate, this.state.endDate)
            }
          >
            Submit
          </Button>
        </div>
        {this.state.showTables === true ? (
          <div>
            <h3 style={{ marginTop: 20 }}>
              {/*this.state.calculatedStartDate.getDate()}/
              {this.addOne(this.state.calculatedStartDate.getMonth())}/
              {this.state.calculatedStartDate.getFullYear()}
              {this.state.calculatedEndDate !== null
                ? "   -   " +
                  this.state.calculatedEndDate.getDate() +
                  "/" +
                  this.addOne(this.state.calculatedEndDate.getMonth()) +
                  "/" +
                  this.state.calculatedEndDate.getFullYear()
              : null*/}
            </h3>

            <GridContainer spacing={2}>
              <GridItem xs={12} sm={12} md={3}>
                <Table
                  tableTitle="Popular queries"
                  tableHeaderColor="gray"
                  tableHead={["#", "Query", "Count", " "]}
                  headerLinkIcon={<OpenWithIcon />}
                  headerLinkPath={`expanded?id=${this.state.evaluationId}&type=1`}
                  tableData={this.state.popularQueries}
                  firstColumn={["search_string"]}
                  secondColumn={["n"]}
                  localLinkPath="url"
                  localLinkIcon={<TimelineIcon />}
                  externalLink={false}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={8} style={{ marginTop: 20, marginLeft: 10 }}>
                <BarChart
                  title="Popular queries"
                  data={this.state.popularQueries}
                  xVariable="search_string"
                  yVariable="n"
                  yLabel="Queries"
                  page={-1}
                />
              </GridItem>

              <GridItem xs={12} sm={12} md={3} style={{ marginTop: 20 }}>
                <Table
                  tableTitle="Unsuccessful queries"
                  tableHeaderColor="gray"
                  tableHead={["#", "Query", "Count", " "]}
                  headerLinkIcon={<OpenWithIcon />}
                  headerLinkPath={`expanded?id=${this.state.evaluationId}&type=2`}
                  tableData={this.state.unsuccessfulQueries}
                  firstColumn={["search_string"]}
                  secondColumn={["n"]}
                  localLinkPath="url"
                  localLinkIcon={<TimelineIcon />}
                  externalLink={false}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={8} style={{ marginTop: 40, marginLeft: 10 }}>
                <BarChart
                  title="Unsuccessful queries"
                  data={this.state.unsuccessfulQueries}
                  xVariable="search_string"
                  yVariable="n"
                  yLabel="Queries"
                  page={-1}
                />
              </GridItem>

              <GridItem xs={12} sm={12} md={3} style={{ marginTop: 20 }}>
                <Table
                  tableTitle="Popular pages"
                  tableHeaderColor="gray"
                  tableHead={["#", "IDs", "Count", " ", " "]}
                  headerLinkIcon={<OpenWithIcon />}
                  headerLinkPath={`expanded?id=${this.state.evaluationId}&type=3`}
                  tableData={this.state.popularPages}
                  firstColumn={["partialUrl"]}
                  secondColumn={["n"]}
                  localLinkPath="localUrl"
                  localLinkIcon={<MenuBookIcon />}
                  externalLink={true}
                  externalLinkPath="fullUrl"
                  externalLinkIcon={<img width="25" src={ZzIcon} />}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={8} style={{ marginTop: 40, marginLeft: 10 }}>
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
          </div>
        ) : null}
      </div>
    );
  }
}

export default Result;
