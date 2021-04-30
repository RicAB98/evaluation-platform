import React, { Component } from "react";
// core components
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextRotationNoneIcon from "@material-ui/icons/TextRotationNone";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import ZzIcon from "../../assets/img/logo.png";
import OpenWithIcon from "@material-ui/icons/OpenWith";
import ButtonGroup from "@material-ui/core/ButtonGroup";

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
    startDate: new Date("2021-01-20 0:0"),
    endDate: "",
    calculatedStartDate: null,
    calculatedEndDate: null,
    checkbox: false,
  };

  componentDidMount() {
    let endDate = new Date();
    endDate.setHours(23);
    endDate.setMinutes(59);
    this.setState({ endDate: endDate });

    let search = window.location.search;
    let params = new URLSearchParams(search);

    let startDate = params.get("startDate");
    endDate = params.get("endDate");

    if (startDate !== null && new Date(startDate) != "Invalid Date")
      this.setState({ startDate: new Date(startDate) }, () => {
        this.submitEvaluation(new Date(startDate), new Date(endDate), true);
      });

    if (endDate !== null && new Date(startDate) != "Invalid Date")
      this.setState({ endDate: new Date(endDate), checkbox: true });
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
    let hours = date.getHours() <= 9 ? "0" + date.getHours() : date.getHours();
    let minutes =
      date.getMinutes() <= 9 ? "0" + date.getMinutes() : date.getMinutes();

    return (
      date.getFullYear() + "-" + month + "-" + day + "T" + hours + ":" + minutes
    );
  }

  toRegularDateFormat(date) {
    return date != null ? date.replace("T", " ") : null;
  }

  submitEvaluation(startDate, endDate, fromURL) {
    this.setState({ calculatedStartDate: startDate });
    this.setState({ calculatedEndDate: null });
    this.setState({ showTables: true });

    if (this.state.checkbox == true) {
      this.setState({ calculatedEndDate: endDate });

      if (!fromURL)
        this.props.history.push({
          pathname: "/admin/daily",
          search:
            "?startDate=" +
            this.toISOString(startDate) +
            "&endDate=" +
            this.toISOString(endDate),
        });

      runEvaluation(startDate, endDate)
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
      if (!fromURL)
        this.props.history.push({
          pathname: "/admin/daily",
          search: "?startDate=" + this.toISOString(startDate),
        });

      this.setState({ calculatedEndDate: null });

      runEvaluation(startDate, null)
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
    this.setState({ startDate: new Date(event.target.value) });
  };

  changeEndDate = (event) => {
    this.setState({ endDate: new Date(event.target.value) });
  };

  last30min() {
    this.setState({
      startDate: new Date(this.state.startDate - 60000 * 30),
      endDate: this.state.startDate,
      checkbox: true,
    });
  }

  last60min() {
    this.setState({
      startDate: new Date(this.state.startDate - 60000 * 60),
      endDate: this.state.startDate,
      checkbox: true,
    });
  }

  last24hours() {
    this.setState({
      startDate: new Date(this.state.startDate - 60000 * 60 * 24),
      endDate: this.state.startDate,
      checkbox: true,
    });
  }

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
                  style={{ color: "#2c3e50" }}
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
          ) : (
            <ButtonGroup
              orientation="vertical"
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
          )}
          <Button
            color="custom"
            onClick={() =>
              this.submitEvaluation(
                this.state.startDate,
                this.state.endDate,
                false
              )
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
                  headerLinkPath={"expanded?type=1&startDate=" + this.toISOString(this.state.calculatedStartDate) + 
                  (this.state.calculatedEndDate !== null ? "&endDate=" + this.toISOString(this.state.calculatedEndDate) : "")}
                  localLinkAditionalInfo={
                  "&startDate=" + this.toISOString(this.state.calculatedStartDate) + 
                  (this.state.calculatedEndDate !== null ? "&endDate=" + this.toISOString(this.state.calculatedEndDate) : "")
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
                md={8}
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

              <GridItem xs={12} sm={12} md={3} style={{ marginTop: 20 }}>
                <Table
                  tableTitle="Unsuccessful queries"
                  tableHeaderColor="gray"
                  tableHead={["#", "Query", "Count", " "]}
                  headerLinkIcon={<OpenWithIcon />}
                  headerLinkPath={"expanded?type=2&startDate=" + this.toISOString(this.state.calculatedStartDate) + 
                  (this.state.calculatedEndDate !== null ? "&endDate=" + this.toISOString(this.state.calculatedEndDate) : "")}
                  tableData={this.state.unsuccessfulQueries}
                  firstColumn={["search_string"]}
                  secondColumn={["n"]}
                  localLinkPath="url"
                  localLinkAditionalInfo={
                    "&startDate=" + this.toISOString(this.state.calculatedStartDate) + 
                    (this.state.calculatedEndDate !== null ? "&endDate=" + this.toISOString(this.state.calculatedEndDate) : "")
                    }
                  localLinkIcon={<TextRotationNoneIcon />}
                  externalLink={false}
                />
              </GridItem>
              <GridItem
                xs={12}
                sm={12}
                md={8}
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

              <GridItem xs={12} sm={12} md={3} style={{ marginTop: 20 }}>
                <Table
                  tableTitle="Popular pages"
                  tableHeaderColor="gray"
                  tableHead={["#", "IDs", "Count", " ", " "]}
                  headerLinkIcon={<OpenWithIcon />}
                  headerLinkPath={"expanded?type=3&startDate=" + this.toISOString(this.state.calculatedStartDate) + 
                  (this.state.calculatedEndDate !== null ? "&endDate=" + this.toISOString(this.state.calculatedEndDate) : "")}
                  tableData={this.state.popularPages}
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
              </GridItem>
              <GridItem
                xs={12}
                sm={12}
                md={8}
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
          </div>
        ) : null}
      </div>
    );
  }
}

export default Result;
