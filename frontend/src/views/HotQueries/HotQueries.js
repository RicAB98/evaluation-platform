import React, { Component } from "react";

// core components
import SortingTable from "../../components/Table/SortingTable";
import TextRotationNoneIcon from "@material-ui/icons/TextRotationNone";
import MenuBookIcon from "@material-ui/icons/MenuBook";

import { getHotQueries, getHotPages } from "../../requests/requests.js";

class HotQueries extends Component {
  state = {
    hotQueries: [
      {
        search_string: "Loading",
        avgRank: 0,
        totalLast24h: 0,
        totalPrevious24h: 0,
        totalLast7days: 0,
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
        GrowthLast24h: 0,
        GrowthLast7d: 0,
      },
    ],

    startDate: new Date(),
    endDate: new Date("2021-1-23 23:59"),
    queryDefaultMinimum: 10,
    pageDefaultMinimum: 10
  };

  componentDidMount() {
    let sevenDaysEarlier = new Date(this.state.endDate - 60000 * 60 * 24 * 7) 
    sevenDaysEarlier.setHours(0)
    sevenDaysEarlier.setMinutes(0)
    this.setState({ startDate: sevenDaysEarlier  }, () => this.submitEvaluation() )
  }

  getDate(date) {
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

  addOne(value) {
    return value + 1;
  }

  changeQueryDefaultMinimum = (event) => {
    this.setState({ queryDefaultMinimum: event.target.value }, () => this.getHotQueries());
  };

  changePageDefaultMinimum = (event) => {
    this.setState({ pageDefaultMinimum: event.target.value }, () => this.getHotPages());
  };

  submitEvaluation = () => {
    
    this.getHotQueries();
    this.getHotPages();
  };

  getHotQueries() {

    this.setState({hotQueries: [
      {
        search_string: "Loading",
        avgRank: 0,
        totalLast24h: 0,
        totalPrevious24h: 0,
        totalLast7days: 0,
        GrowthLast24h: 0,
        GrowthLast7d: 0,
      },
    ]})

    getHotQueries(this.state.endDate, this.state.queryDefaultMinimum)
      .then((res) => res.json())
      .then((res) => this.setState({ hotQueries: res }));
  };

  getHotPages() {
    this.setState({hotPages: [
      {
        search_string: "Loading",
        avgRank: 0,
        totalLast24h: 0,
        totalPrevious24h: 0,
        totalLast7days: 0,
        GrowthLast24h: 0,
        GrowthLast7d: 0,
      },
    ]})

    getHotPages(this.state.endDate, this.state.pageDefaultMinimum)
      .then((res) => res.json())
      .then((res) => this.setState({ hotPages: res }));
  }

  render() {
    return (
      <div style={{ marginTop: 20, marginLeft: 16 }}>
        <SortingTable
          tableTitle = "Hot Queries"
          rows={this.state.hotQueries}
          includeInsuccess={true}
          localLinkPath="/admin/query?"
          localLinkFields={["search_string"]}
          localLinkAdditional={
            "&startDate=" + this.getDate(this.state.startDate) + "&endDate=" + this.getDate(this.state.endDate)
          }
          iconButton={<TextRotationNoneIcon />}
          defaultMinimum = {this.state.queryDefaultMinimum}
          dropdownOnChange = {this.changeQueryDefaultMinimum}
        />
        <SortingTable
          tableTitle = "Hot Pages"
          rows={this.state.hotPages}
          includeInsuccess={false}
          localLinkPath="/admin/page?"
          localLinkFields={["tp_item", "fk_item"]}
          localLinkAdditional={
            "&startDate=" + this.getDate(this.state.startDate) + "&endDate=" + this.getDate(this.state.endDate)
          }
          iconButton={<MenuBookIcon />}
          style = {{marginTop: 300}}
          defaultMinimum = {this.state.pageDefaultMinimum}
          dropdownOnChange = {this.changePageDefaultMinimum}
        />
      </div>
    );
  }
}

export default HotQueries;
