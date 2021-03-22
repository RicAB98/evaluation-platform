import React, {Component} from "react";
// react plugin for creating charts
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
// core components
import FormControl from "../../components/Dropdown/Dropdown.js";

import { bugs, website, server } from "../../variables/general.js";

import {
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart
} from "../../variables/charts.js";

import styles from "../../assets/jss/material-dashboard-react/views/dashboardStyle.js";

const useStyles = makeStyles(styles);

class Dashboard extends Component {
  state = {
    evaluations: [
      [1, "First"],
      [2, "Second"],
      [3, "Third"]
    ]
  }

  render() {
    return (<FormControl
              evaluationList={this.state.evaluations}
            />)
  }
}

export default Dashboard;
