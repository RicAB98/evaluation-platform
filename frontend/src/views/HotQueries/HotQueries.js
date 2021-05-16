import React, { Component } from "react";
import { Helmet } from 'react-helmet';

// core components
import SortingTable from "../../components/Table/SortingTable";
import TextRotationNoneIcon from "@material-ui/icons/TextRotationNone";
import MenuBookIcon from "@material-ui/icons/MenuBook";

import { getHotQueries, getHotPages } from "../../requests/requests.js";
import { toISOString} from "../../utils/utils.js"

class HotQueries extends Component {
  state = {
    hotQueries: [
      {
        search_string: "Loading",
        avgRank: 0,
        totalLast24h: 0,
        totalPrevious24h: 0,
        totalLast7days: 0,
        total7daysAgo: 0,
        GrowthLast24h: 0,
        GrowthLast7d: 0,
      },
    ],

    hotPages: [
      {
        search_string: "Loading",
        avgRank: 0,
        totalLast24h: 0,
        totalPrevious24h: 0,
        totalLast7days: 0,
        total7daysAgo: 0,
        GrowthLast24h: 0,
        GrowthLast7d: 0,
      },
    ],

    startDate: new Date(),
    endDate: new Date("2021-1-31 23:59"),
    queryMinimum: 10,
    pageMinimum: 10,
    calculatedQueryMinimum: 10,
    calculatedPageMinimum: 10
  };

  componentDidMount() {
    let sevenDaysEarlier = new Date(this.state.endDate - 60000 * 60 * 24 * 7) 
    sevenDaysEarlier.setHours(0)
    sevenDaysEarlier.setMinutes(0)
    this.setState({ startDate: sevenDaysEarlier  }, () => this.submitEvaluation() )
  }

  changeQueryMinimum = (event) => {
    if (event.target.value === "") return

    this.setState({ queryMinimum: event.target.value }, 
      () => 
      {
        if(event.target.value  < this.state.calculatedQueryMinimum) this.getHotQueries();
      }) 
  };

  changePageMinimum = (event) => {

    if (event.target.value === "") return

    this.setState({ pageMinimum: event.target.value }, 
      () => 
      {
        if(event.target.value  < this.state.calculatedPageMinimum) this.getHotPages();
      }) 
  };

  submitEvaluation = () => {
    
    this.getHotQueries();
    this.getHotPages();
  };

  getHotQueries() {

    this.setState({
      calculatedQueryMinimum: this.state.queryMinimum,
      hotQueries: [
      {
        search_string: "Loading",
        avgRank: 0,
        totalLast24h: 0,
        totalPrevious24h: 0,
        totalLast7days: 0,
        total7daysAgo: 0,
        GrowthLast24h: 0,
        GrowthLast7d: 0,
      },
    ]})

    getHotQueries(this.state.endDate, this.state.queryMinimum)
      .then((res) => res.json())
      .then((res) => this.setState({ hotQueries: res }));
  };

  getHotPages() {
    this.setState({
      calculatedPageMinimum: this.state.pageMinimum,
      hotPages: [
      {
        search_string: "Loading",
        avgRank: 0,
        totalLast24h: 0,
        totalPrevious24h: 0,
        totalLast7days: 0,
        total7daysAgo: 0,
        GrowthLast24h: 0,
        GrowthLast7d: 0,
      },
    ]})

    getHotPages(this.state.endDate, this.state.pageMinimum)
      .then((res) => res.json())
      .then((res) => this.setState({ hotPages: res }));
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>{ "Trending" }</title>
        </Helmet>
        <div style={{ marginTop: 20, marginLeft: 16 }}>
          <SortingTable
            tableTitle = "Hot Queries"
            rows={this.state.hotQueries}
            includeInsuccess={true}
            localLinkPath="/admin/query?"
            localLinkFields={["search_string"]}
            localLinkAdditional={
              "&startDate=" + toISOString(this.state.startDate) + "&endDate=" + toISOString(this.state.endDate)
            }
            iconButton={<TextRotationNoneIcon />}
            minimum = {this.state.queryMinimum}
            dropdownOnChange = {this.changeQueryMinimum}
          />
          <SortingTable
            tableTitle = "Hot Pages"
            rows={this.state.hotPages}
            includeInsuccess={false}
            localLinkPath="/admin/page?"
            localLinkFields={["tp_item", "fk_item"]}
            localLinkAdditional={
              "&startDate=" + toISOString(this.state.startDate) + "&endDate=" + toISOString(this.state.endDate)
            }
            iconButton={<MenuBookIcon />}
            style = {{marginTop: 300}}
            minimum = {this.state.pageMinimum}
            dropdownOnChange = {this.changePageMinimum}
          />
        </div>
      </div>
    );
  }
}

export default HotQueries;
