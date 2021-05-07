import React, { Component } from "react";

// core components
import TextRotationNoneIcon from "@material-ui/icons/TextRotationNone";
import ZzIcon from "../../assets/img/logo.png";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import Button from "../../components/Button/Button.js";
import ExpandableTable from "../../components/Table/ExpandableTable";
import Dropdown from "../../components/Dropdown/Dropdown.js";
import Table2 from "../../components/Table/Table2.js";
import TimePicker from "../../components/Calendar/TimePicker.js";
import List from "../../components/List/List";

import { getPagesRank, getPageSummary, getStringsPerRank } from "../../requests/requests.js";

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

    checkbox: false,

    calculatedTp_Item: 0,
    calculatedFk_Item: 0,
    calculatedStartDate: null,
    calculatedEndDate: null,

    calculatedRank: null,
    showPagesRank: false,
    showStringsPerRank: false,

    pageLink: "",

    page: 0,
    rowsPerPage: 10,

    tableData: [
      {
        page_number: 1,
        mysql_id: 0,
        n: "Loading...",
      },
    ],

    pageSummary: [{
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
        checkbox: endDate != null ? true : false,
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

  toRegularFormat(date) {
    return (
      date.getFullYear() +
      "-" +
      this.addOne(date.getMonth()) +
      "-" +
      date.getDate()
    );
  }

  handleCheckbox = (event) => {
    this.setState({ checkbox: event.target.checked });
  };

  changeValue = (event) => {
    this.setState({ [event.target.id]: event.target.value });
  };

  changeTpItem = (event) => {
    this.setState({ tp_item: event.target.value });
  };

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
      this.toISOString(this.state.startDate);

    urlSearch +=
      this.state.checkbox == true
        ? "&endDate=" + this.toISOString(this.state.endDate)
        : "";

    this.props.history.push({
      pathname: "/admin/page",
      search: urlSearch,
    });

    this.setState({
      tableData: [
        {
          page_number: 1,
          mysql_id: 0,
          n: "Loading...",
        },
      ],
      pageLink: "",
      showPagesRank: false,
      calculatedTp_Item: this.state.tp_item,
      calculatedFk_Item: this.state.fk_item,
      calculatedStartDate: this.state.startDate,
      calculatedEndDate:
        this.state.checkbox == true ? this.state.endDate : null,
    });

    getPageSummary(
      this.state.tp_item,
      this.state.fk_item,
      this.state.startDate,
      this.state.checkbox == true ? this.state.endDate : null
    )
      .then((res) => res.json())
      .then(
        (res) => this.setState({ pageSummary: res })
      );

    getPageSummary(
      this.state.tp_item,
      this.state.fk_item,
      this.state.today
    )
      .then((res) => res.json())
      .then(
        (res) => this.setState({ last24HourSummary: res })
      );

    getPagesRank(
      this.state.tp_item,
      this.state.fk_item,
      this.state.startDate,
      this.state.checkbox == true ? this.state.endDate : null
    )
      .then((res) => res.json())
      .then(
        (res) =>
          this.setState({ tableData: res["rank"], pageLink: res["link"] }),
        this.setState({ showPagesRank: true })
      );
  };

  changeStartDate = (event) => {
    this.setState({ startDate: new Date(event.target.value) });
  };

  changeEndDate = (event) => {
    this.setState({ endDate: new Date(event.target.value) });
  };

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
              label={this.state.checkbox === true ? "Start date" : "Date"}
            />
            {this.state.checkbox === true ? (
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
                  checked={this.state.checkbox}
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

        <div style={{ marginTop: 20, marginLeft: 16 }}>
          <GridContainer>
            <GridItem
              xs={12}
              lg={4}
            >
              {this.state.showPagesRank === true ? (
                <Table2
                  tableTitle={"Page's ranks"}
                  tableHeaderColor="gray"
                  tableHead={["Rank", "Clicks", ""]}
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
            <GridItem
              xs={12}
              lg={8}
              style={{marginTop: 70}}
            >
              <List
                rangeInfo = {this.state.pageSummary[0]}
                last24hInfo = {this.state.last24HourSummary[0]}
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={2} style={{marginTop: 20}}>
              {this.state.showStringsPerRank === true ? (
                <ExpandableTable
                  tableTitle={
                    "Searched strings for rank " + this.state.calculatedRank
                  }
                  tableHeaderColor="gray"
                  tableHead={["#", "Query", "Count", " "]}
                  tableData={this.state.stringsPerRank}
                  firstColumn={["search_string"]}
                  secondColumn={["n"]}
                  localLinkPath="localLink"
                  localLinkAditionalInfo={
                    "&startDate=" +
                    this.toISOString(this.state.calculatedStartDate) +
                    (this.state.calculatedEndDate !== null
                      ? "&endDate=" +
                        this.toISOString(this.state.calculatedEndDate)
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
