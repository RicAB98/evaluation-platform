import React, { Component } from "react";

// core components
import LinkIcon from '@material-ui/icons/Link';

import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import Button from "../../components/Button/Button.js";
import LineChart from "../../components/Chart/LineChart";
import Table from "../../components/Table/Table.js";
import Table2 from "../../components/Table/Table2.js";
import { queryGraph, getClicksRanks, getPagesPerRank } from "../../requests/requests.js";

class QueryPerformance extends Component {
  state = {
    startDate: new Date("2021-01-29"),
    endDate: null,

    string:
    this.props.location.search === ""
      ? ""
      : decodeURIComponent(this.props.location.search.replace("?string=", "")),
    
    calculatedString : null,
    calculatedRank : null,

    showGraph: false,
    showClickRank: false,
    showPagesPerRank: false,

    clickRank: [
      {
        rank: "Loading...",
        n: "Loading...",
      },
    ],
    pagesPerRank: [
      {
        page: "Loading...",
        mysql_id:  "Loading...",
        n: "Loading...",
      },
    ],
    data: [
      {
        id: "loading",
        color: "hsl(0, 70%, 50%)",
        data: [
          {
            x: "20-01",
            y: 0,
          },
        ],
      },
    ],
  };

  componentDidMount() {
    if (this.state.string !== "") this.submitEvaluation();
  }

  changeValue = (event) => {
    this.setState({ string: event.target.value });
  };

  submitPagesPerRank = (page, mysql_id) =>
  {
    this.setState({
      calculatedRank: 10 * (page-1) + mysql_id,
      pagesPerRank: [
        {
          page: "Loading...",
          mysql_id:  "Loading...",
          n: "Loading...",
        },
      ],
    });
    
    getPagesPerRank(page, mysql_id, this.state.calculatedString)
    .then((res) => res.json())
      .then(
        (res) => this.setState({ pagesPerRank: res }),
        this.setState({ showPagesPerRank: true })
      );
  }

  submitEvaluation = () => {
    this.props.history.push({
      pathname: "/admin/query",
      search: "?string=" + this.state.string,
    });

    this.setState({calculatedString: this.state.string})
    this.setState({showPagesPerRank: false})

    this.setState({
      clickRank: [
        {
          page_number: 1,
          mysql_id: 0,
          n: "Loading...",
        },
      ],
    });

    this.setState({
      data: [
        {
          id: "loading",
          color: "hsl(0, 70%, 50%)",
          data: [
            {
              x: "20-01",
              y: 0,
            },
          ],
        },
      ],
    });

    queryGraph(this.state.string)
      .then((res) => res.json())
      .then(
        (res) => this.setState({ data: res }),
        this.setState({ showGraph: true })
      );
    getClicksRanks(this.state.string)
      .then((res) => res.json())
      .then(
        (res) => this.setState({ clickRank: res }),
        this.setState({ showClickRank: true })
      );
  };

  render() {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: 400,
            justifyContent: "space-around",
          }}
        >
          <label
            style={{ marginLeft: 8, marginTop: "auto", marginBottom: "auto" }}
          >
            Query:
            <input
              value={this.state.string}
              onChange={this.changeValue}
              type="text"
              style={{ marginLeft: 8, marginTop: "auto", marginBottom: "auto" }}
            />
          </label>
          <Button color="custom" onClick={() => this.submitEvaluation()}>
            Submit
          </Button>
        </div>
        
        <GridContainer>
          <GridItem xs={this.state.showPagesPerRank === true ? 12: 18} 
                sm={this.state.showPagesPerRank === true ? 12: 18}  
                md={this.state.showPagesPerRank === true ? 4: 6} >
          {this.state.showGraph === true ? (
            <LineChart data={this.state.data} />
          ) : null}
          </GridItem>
          <GridItem xs={this.state.showPagesPerRank === true ? 12: 18} 
                sm={this.state.showPagesPerRank === true ? 12: 18}  
                md={this.state.showPagesPerRank === true ? 4: 6} >
          {this.state.showClickRank === true ? (
            <Table2
              tableTitle={"Click's rank for query \"" + this.state.calculatedString + "\""}
              tableHeaderColor="gray"
              tableHead={["Rank", "Clicks", ""]}
              tableData={this.state.clickRank}
              onClick={this.submitPagesPerRank}
            />
            ) : null}
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
          {this.state.showPagesPerRank === true ? (
            <Table
              tableTitle={"Clicked pages on position " + this.state.calculatedRank}
              tableHeaderColor="gray"
              tableHead={["#", "Ids", "Count", ""]}
              tableData={this.state.pagesPerRank}
              firstColumn={["tp_item","fk_item"]}
              secondColumn={["n"]}
              linkPath="link"
              linkIcon={<LinkIcon />}
            />
            ) : null}
          </GridItem>
        </GridContainer>
        {/*<div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "left",
          }}
        >
          {this.state.showGraph === true ? (
            <LineChart data={this.state.data} />
          ) : null}
          {this.state.showTable === true ? (
            <Table
              tableTitle="Results clicked"
              tableHeaderColor="gray"
              tableHead={["Rank", "Clicks"]}
              tableData={this.state.clickRank}
            />
          ) : null}
          </div>*/}
      </div>
    );
  }
}

export default QueryPerformance;
