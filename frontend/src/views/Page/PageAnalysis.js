import React, { Component } from "react";

// core components
import TimelineIcon from "@material-ui/icons/Timeline";
import LinkIcon from "@material-ui/icons/Link";

import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import Button from "../../components/Button/Button.js";
import Table from "../../components/Table/Table.js";
import Table2 from "../../components/Table/Table2.js";

import { getPagesRank, getStringsPerRank } from "../../requests/requests.js";

class PageAnalysis extends Component {
  state = {
    tp_item: "",
    fk_item: "",

    showTable: false,
    showStringsPerRank: false,

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

    tp_item !== null && this.setState({ tp_item: tp_item });
    fk_item !== null && this.setState({ fk_item: fk_item });

    tp_item !== null &&
      fk_item !== null &&
      this.submitEvaluation(tp_item, fk_item);
  }

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
      this.state.calculatedFk_Item
    )
      .then((res) => res.json())
      .then(
        (res) => this.setState({ stringsPerRank: res }),
        this.setState({ showStringsPerRank: true })
      );
  };

  submitEvaluation = (tp_item, fk_item) => {
    this.props.history.push({
      pathname: "/admin/page",
      search: "?tp_item=" + tp_item + "&fk_item=" + fk_item,
    });

    this.setState({
      tableData: [
        {
          page_number: 1,
          mysql_id: 0,
          n: "Loading...",
        },
      ],
      showTable: false,
      calculatedTp_Item: tp_item,
      calculatedFk_Item: fk_item,
    });

    getPagesRank(tp_item, fk_item)
      .then((res) => res.json())
      .then(
        (res) => this.setState({ tableData: res }),
        this.setState({ showTable: true })
      );
  };

  render() {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: 550,
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
              xs={this.state.showPagesPerRank === true ? 12 : 18}
              sm={this.state.showPagesPerRank === true ? 12 : 18}
              md={this.state.showPagesPerRank === true ? 4 : 6}
            >
              {this.state.showTable === true ? (
                <Table2
                  tableTitle={"Page's ranks"}
                  tableHeaderColor="gray"
                  tableHead={["Rank", "Clicks", ""]}
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
                  localLinkPath="/admin/query?"
                  localLinkIcon={<TimelineIcon />}
                  externalLink={false}
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

export default PageAnalysis;
