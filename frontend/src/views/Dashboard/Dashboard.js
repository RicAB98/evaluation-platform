import React, {Component} from "react";
// react plugin for creating charts
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
// core components
import Dropdown from "../../components/Dropdown/Dropdown.js";

import { getEvaluations } from "../../requests/requests.js";

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

  componentDidMount()
  {
    getEvaluations()
    .then(res => res.json())
    .then(res => this.setState({ evaluations: res }))
  }

  render() {
    console.log(this.state.evaluations)
    return (<Dropdown
              evaluationList={this.state.evaluations}
            />)
  }
}

export default Dashboard;
