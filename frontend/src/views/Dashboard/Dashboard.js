import React, {Component} from "react";
import Dropdown from "../../components/Dropdown/Dropdown.js";
import { getEvaluations } from "../../requests/requests.js";

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
