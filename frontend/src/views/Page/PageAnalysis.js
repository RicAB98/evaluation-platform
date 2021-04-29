import React, { Component } from "react";

// core components
import TextRotationNoneIcon from "@material-ui/icons/TextRotationNone";
import IconButton from "@material-ui/core/IconButton";
import ZzIcon from "../../assets/img/logo.png";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import Button from "../../components/Button/Button.js";
import Table from "../../components/Table/Table.js";
import Table2 from "../../components/Table/Table2.js";
import Calendar from "../../components/Calendar/Calendar.js";

import { getPagesRank, getStringsPerRank } from "../../requests/requests.js";

class PageAnalysis extends Component {
  state = {
    tp_item: "",
    fk_item: "",
    startDate: new Date(),
    endDate: new Date(),
    checkbox: false,
    calculatedStartDate: null,
    calculatedEndDate: null,

    showPagesRank: false,
    showStringsPerRank: false,

    pageLink: "",
    calculatedTp_Item: 0,
    calculatedFk_Item: 0,
    calculatedRank: null,

    tableData: [
      {
        page_number: 1,
        mysql_id: 0,
        n: "Loading...",
      },
    ],

    stringsPerRank: null,
  };

  componentDidMount() {
    let search = window.location.search;
    let params = new URLSearchParams(search);

    let tp_item = params.get("tp_item");
    let fk_item = params.get("fk_item");
    let startDate = params.get("startDate");
    let endDate = params.get("endDate");

    this.setState({
      tp_item: tp_item != null ? tp_item : "",
      fk_item: fk_item != null ? fk_item : "",
      startDate: startDate != null ? new Date(startDate) : new Date(),
      endDate: endDate != null ? new Date(endDate) : new Date(),
      checkbox: endDate != null ? true : false,
    },
    () => {if(tp_item != null && fk_item != null && startDate != null)
            this.submitEvaluation()
    });
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
      this.toRegularFormat(this.state.startDate);

    urlSearch +=
      this.state.checkbox == true
        ? "&endDate=" + this.toRegularFormat(this.state.endDate)
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
      calculatedTp_Item: this.state.tp_item ,
      calculatedFk_Item: this.state.fk_item,
      calculatedStartDate: this.state.startDate,
      calculatedEndDate:
        this.state.checkbox == true ? this.state.endDate : null,
    });

    getPagesRank(
      this.state.tp_item ,
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

  changeStartDate = (date) => {
    this.setState({ startDate: new Date(date) });
  };

  changeEndDate = (date) => {
    this.setState({ endDate: new Date(date) });
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
            width: 900,
            justifyContent: "space-around",
          }}
        >
          <label
            style={{ marginLeft: 8, marginTop: "auto", marginBottom: "auto" }}
          >
            Tp_item:
            <input
              value={this.state.tp_item}
              onChange={this.changeValue}
              id="tp_item"
              type="text"
              style={{
                marginLeft: 8,
                marginTop: "auto",
                marginBottom: "auto",
                width: 110,
              }}
            />
          </label>
          <label
            style={{ marginLeft: 8, marginTop: "auto", marginBottom: "auto" }}
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
          ) : null}
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
              xs={this.state.showPagesRank === true ? 12 : 18}
              sm={this.state.showPagesRank === true ? 12 : 18}
              md={this.state.showPagesRank === true ? 4 : 6}
            >
              {this.state.showPagesRank === true ? (
                <Table2
                  tableTitle={"Page's ranks"}
                  tableHeaderColor="gray"
                  tableHead={["Rank", "Clicks", ""]}
                  headerLinkIcon={this.state.pageLink != "" ? <img width="35" src={ZzIcon} /> : ""}
                  headerLinkPath={this.state.pageLink}
                  tableData={this.state.tableData}
                  onClick={this.submitStringsPerRank}
                />
              ) : null}
            </GridItem>
            <GridItem xs={12} sm={12} md={4}>
              {this.state.showStringsPerRank === true ? (
                <Table
                  tableTitle={
                    "Searched strings for rank " + this.state.calculatedRank
                  }
                  tableHeaderColor="gray"
                  tableHead={["#", "String", "Count", ""]}
                  tableData={this.state.stringsPerRank}
                  firstColumn={["search_string"]}
                  secondColumn={["n"]}
                  localLinkPath="localLink"
                  localLinkIcon={<TextRotationNoneIcon />}
                  localLinkAditionalInfo={
                    "&startDate=" + this.toRegularFormat(this.state.calculatedStartDate) + 
                    (this.state.calculatedEndDate !== null ? "&endDate=" + this.toRegularFormat(this.state.calculatedEndDate) : "")
                    }
                  externalLink={false}
                  externalLinkPath="link"
                  externalLinkIcon={<img width="25" src={ZzIcon} />}
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
