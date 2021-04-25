import React, { Component } from "react";
// core components
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TimelineIcon from "@material-ui/icons/Timeline";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import LinkIcon from "@material-ui/icons/LinkOff";

import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import Button from "../../components/Button/Button.js";
import Table from "../../components/Table/Table.js";
import Calendar from "../../components/Calendar/Calendar.js";

import {
  topQueries,
  unsuccessfulQueries,
  topPages,
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
    popularPages: [
      {
        tp_item: 0,
        fk_item: 0,
        n: "Loading...",
      },
    ],
    startDate: new Date("2021-01-20"),
    endDate: null,
    calculatedStartDate: null,
    calculatedEndDate: null,
    checkbox: false,
  };

  handleCheckbox = (event) => {
    this.setState({ checkbox: event.target.checked });
    this.setState({ endDate: null });
  };

  componentDidMount() {
    let search = window.location.search;
    let params = new URLSearchParams(search);

    let startDate = params.get("startDate");
    let endDate = params.get("endDate"); 

    if(startDate !== null && new Date(startDate) != 'Invalid Date')
      this.setState({ startDate: new Date(startDate) }, () => {new Date(endDate) != 'Invalid Date' && this.submitEvaluation(startDate, endDate) });

    if(endDate !== null && new Date(endDate) != 'Invalid Date')
      this.setState({ endDate: new Date(endDate), checkbox: true});

  }

  submitEvaluation(startDate, endDate) {
    startDate = new Date(startDate);

    this.setState({ calculatedStartDate: startDate });
    this.setState({ showTables: true }); 

    if (endDate != null) {
      
      endDate = new Date(endDate);

      startDate.setHours(0);
      startDate.setMinutes(0);
      startDate.setSeconds(0);

      endDate.setHours(23);
      endDate.setMinutes(59);
      endDate.setSeconds(59);

      this.setState({ calculatedEndDate: endDate });

      this.props.history.push({
        pathname: "/admin/daily",
        search: "?startDate=" + startDate.toISOString().split('T')[0] + "&endDate=" + endDate.toISOString().split('T')[0],
      });

      this.getPopularQueries(startDate, endDate);
      this.getUnsuccessfulQueries(startDate, endDate);
      this.getPopularPages(startDate, endDate);

    } else {

      this.props.history.push({
        pathname: "/admin/daily",
        search: "?startDate=" + startDate.toISOString().split('T')[0],
      });

      this.setState({ calculatedEndDate: null });

      loadDailyEvaluation(startDate)
        .then((res) => res.json())
        .then((res) =>
          this.setState(
            { popularQueries: JSON.parse(res[0]["popularQueries"]),  
              unsuccessfulQueries: JSON.parse(res[0]["unsuccessful"]),
              popularPages: JSON.parse(res[0]["popularPages"])
            },
          )
        );
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

  getPopularPages = (startDate, endDate) => {
    this.setState({
      popularPages: [{tp_item: 0,fk_item: 0,n: "Loading...",},],});

    topPages(startDate, endDate)
      .then((res) => res.json())
      .then((res) => this.setState({ popularPages: res }));
  };

  changeStartDate = (date) => {
    this.setState({ startDate: date });
  };

  changeEndDate = (date) => {
    this.setState({ endDate: date });
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
          <Button color="custom" onClick={() => this.submitEvaluation(this.state.startDate, this.state.endDate)}>
            Submit
          </Button>
        </div>
        {this.state.showTables === true ? (
          <div>
            <h3 style={{ marginTop: 20 }}>
              {this.state.calculatedStartDate.getDate()}/
              {this.addOne(this.state.calculatedStartDate.getMonth())}/
              {this.state.calculatedStartDate.getFullYear()}
              {this.state.calculatedEndDate !== null
                ? "   -   " +
                  this.state.calculatedEndDate.getDate() +
                  "/" +
                  this.addOne(this.state.calculatedEndDate.getMonth()) +
                  "/" +
                  this.state.calculatedEndDate.getFullYear()
                : null}
            </h3>
            <GridContainer
              /*style={{
                display: "flex",
                flexDirection: "row",
                width: "75%",
                justifyContent: "space-between",
              }}*/
            >
              <GridItem
              xs={12}
              sm={12}
              md={4}
            >
              <Table
                tableTitle="Popular queries"
                tableHeaderColor="gray"
                tableHead={["#", "Query", "Occurrences", " "]}
                tableData={this.state.popularQueries}
                firstColumn={["search_string"]}
                secondColumn={["n"]}
                localLinkPath="/admin/query?"
                localLinkIcon={<TimelineIcon />}
                externalLink={false}
              />
              </GridItem>
              <GridItem
              xs={12}
              sm={12}
              md={4}
            >
              <Table
                tableTitle="Unsuccessful queries"
                tableHeaderColor="gray"
                tableHead={["#", "Query", "Occurrences", " "]}
                tableData={this.state.unsuccessfulQueries}
                firstColumn={["search_string"]}
                secondColumn={["n"]}
                localLinkPath="/admin/query?"
                localLinkIcon={<TimelineIcon />}
                externalLink={false}
              />
              </GridItem>
              <GridItem
              xs={12}
              sm={12}
              md={4}
            >
              <Table
                tableTitle="Popular pages"
                tableHeaderColor="gray"
                tableHead={["#", "IDs", "Occurrences", " ", " "]}
                tableData={this.state.popularPages}
                firstColumn={["tp_item", "fk_item"]}
                secondColumn={["n"]}
                localLinkPath="/admin/page?"
                localLinkIcon={<MenuBookIcon />}
                externalLink={true}
                externalLinkPath="link"
                externalLinkIcon={<LinkIcon />}
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
