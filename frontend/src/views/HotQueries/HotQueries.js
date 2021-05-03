import React, { Component } from "react";

// core components
import SortingTable from "../../components/Table/SortingTable";
import TextRotationNoneIcon from "@material-ui/icons/TextRotationNone";
import MenuBookIcon from "@material-ui/icons/MenuBook";

import { getHotQueries, getHotPages } from "../../requests/requests.js";

class HotQueries extends Component {
  state = {
    hotQueries:[{
      tp_item: 1,
      fk_item: 2,
      avgRank: 1,
      totalLast24h: 2121,
      totalLast4days: 21344,
      GrowthLast24h: "2",
      GrowthLast4d: "-5"
    }],

    hotPages:[{
      tp_item: 1,
      fk_item: 2,
      avgRank: 1,
      totalLast24h: 2121,
      totalLast4days: 21344,
      GrowthLast24h: "2",
      GrowthLast4d: "-5"
    }],

    startDate: new Date()
  };

  componentDidMount() {
    this.submitEvaluation()
  }

  submitEvaluation = () => {

    getHotQueries(this.state.startDate)
      .then((res) => res.json())
      .then(
        (res) => this.setState({ hotQueries: res }));
    getHotPages(this.state.startDate)
      .then((res) => res.json())
      .then(
        (res) => this.setState({ hotPages: res }));
  };

  render() {
    return (
      <div style={{ marginTop: 20, marginLeft: 16 }}>
        <SortingTable
          rows = {this.state.hotQueries}
          localLinkPath="/admin/query?"
          localLinkFields={["search_string"]}
          iconButton = {<TextRotationNoneIcon/>}
        />
        <SortingTable
          rows = {this.state.hotPages}
          localLinkPath="/admin/page?"
          localLinkFields={["tp_item", "fk_item"]}
          iconButton = {<MenuBookIcon/>}
        />
      </div>
    );
  }
}

export default HotQueries;
