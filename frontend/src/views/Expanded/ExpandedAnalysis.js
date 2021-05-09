import React, { Component } from "react";
// core components

import TextRotationNoneIcon from "@material-ui/icons/TextRotationNone";

import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import BarChart from "../../components/Chart/BarChart.js";
import Table from "../../components/Table/ExpandableTable";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import ZzIcon from "../../assets/img/logo.png";

import { loadEvaluation } from "../../requests/requests.js";
import { toISOString, addOne } from "../../utils/utils.js"

class ExpandedAnalysis extends Component {
  state = {
    type: -1,

    startDate: new Date(),
    endDate: new Date(),

    tableData: [
      {
        search_string: "Loading...",
        n: "Loading...",
      },
    ],
    page: 0,
    rowsPerPage: 10,
  };

  componentDidMount() {
    let search = window.location.search;
    let params = new URLSearchParams(search);

    let startDate = params.get("startDate");
    let endDate = params.get("endDate");

    this.setState(
      {
        type: params.get("type"),
        startDate: startDate != null ? new Date(startDate) : null,
        endDate: endDate != null ? new Date(endDate) : null,
      },
      () => this.submitEvaluation()
    );
  }

  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage });
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: parseInt(event.target.value, 10), page: 0 });
  };

  submitEvaluation() {
    if (
      this.state.type == -1 ||
      this.state.type == null ||
      this.state.startDate == null
    )
      return;

    loadEvaluation(this.state.type, this.state.startDate, this.state.endDate)
      .then((res) => res.json())
      .then((res) => this.setState({ tableData: res }));
  }

  render() {
    return (
      <div style={{ marginLeft: 16 }}>
        <div>
          {this.state.type == 1 ? (
            <GridContainer spacing={2}>
              <GridItem xs={12}>
                <Table
                  tableTitle="Popular queries"
                  tableHeaderColor="gray"
                  tableHead={["#", "Query", "Count", " "]}
                  tableData={this.state.tableData}
                  firstColumn={["search_string"]}
                  secondColumn={["n"]}
                  localLinkPath="url"
                  localLinkAditionalInfo={
                    "&startDate=" +
                    toISOString(this.state.startDate) +
                    (this.state.endDate !== null
                      ? "&endDate=" + toISOString(this.state.endDate)
                      : "")
                  }
                  localLinkIcon={<TextRotationNoneIcon />}
                  externalLink={false}
                  page={this.state.page}
                  rowsPerPage={this.state.rowsPerPage}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
              </GridItem>
              <GridItem xs={12} style={{ marginTop: 20, marginLeft: 10 }}>
                <BarChart
                  title="Popular queries"
                  data={this.state.tableData}
                  xVariable="search_string"
                  yVariable="n"
                  yLabel="Queries"
                  page={this.state.page}
                  rowsPerPage={this.state.rowsPerPage}
                />
              </GridItem>
            </GridContainer>
          ) : null}
          {this.state.type == 2 ? (
            <GridContainer spacing={2}>
              <GridItem xs={12}>
                <Table
                  tableTitle="Unsuccessful queries"
                  tableHeaderColor="gray"
                  tableHead={["#", "Query", "Count", " "]}
                  tableData={this.state.tableData}
                  firstColumn={["search_string"]}
                  secondColumn={["n"]}
                  localLinkPath="url"
                  localLinkAditionalInfo={
                    "&startDate=" +
                    toISOString(this.state.startDate) +
                    (this.state.endDate !== null
                      ? "&endDate=" + toISOString(this.state.endDate)
                      : "")
                  }
                  localLinkIcon={<TextRotationNoneIcon />}
                  externalLink={false}
                  page={this.state.page}
                  rowsPerPage={this.state.rowsPerPage}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
              </GridItem>
              <GridItem xs={12} style={{ marginTop: 20, marginLeft: 10 }}>
                <BarChart
                  title="Unsuccessful queries"
                  data={this.state.tableData}
                  xVariable="search_string"
                  yVariable="n"
                  yLabel="Queries"
                  page={this.state.page}
                  rowsPerPage={this.state.rowsPerPage}
                />
              </GridItem>
            </GridContainer>
          ) : null}
          {this.state.type == 3 ? (
            <GridContainer spacing={2}>
              <GridItem xs={12}>
                <Table
                  tableTitle="Popular pages"
                  tableHeaderColor="gray"
                  tableHead={["#", "IDs", "Count", " ", " "]}
                  tableData={this.state.tableData}
                  firstColumn={["partialUrl"]}
                  secondColumn={["n"]}
                  localLinkPath="localUrl"
                  localLinkAditionalInfo={
                    "&startDate=" +
                    toISOString(this.state.startDate) +
                    (this.state.endDate !== null
                      ? "&endDate=" + toISOString(this.state.endDate)
                      : "")
                  }
                  localLinkIcon={<MenuBookIcon />}
                  externalLink={true}
                  externalLinkPath="fullUrl"
                  externalLinkIcon={<img width="25" src={ZzIcon} />}
                  page={this.state.page}
                  rowsPerPage={this.state.rowsPerPage}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
              </GridItem>
              <GridItem xs={12} style={{ marginTop: 20, marginLeft: 10 }}>
                <BarChart
                  title="Unsuccessful queries"
                  data={this.state.tableData}
                  xVariable="partialUrl"
                  yVariable="n"
                  yLabel="Queries"
                  page={this.state.page}
                  rowsPerPage={this.state.rowsPerPage}
                />
              </GridItem>
            </GridContainer>
          ) : null}
        </div>
      </div>
    );
  }
}

export default ExpandedAnalysis;
