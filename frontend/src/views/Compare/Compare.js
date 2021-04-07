import React, {Component} from "react";
// core components
import Button from "@material-ui/core/Button";
import Dropdown from "../../components/Dropdown/Dropdown.js";
import StickyHeadTable from "../../components/StickyHeadTable/StickyHeadTable.js"
import { getTestAPI } from "../../requests/requests.js";

class Compare extends Component {
  state = {
      evaluationTypes: [
        [1, "Least successful"],
        [2, "Most searched"],
        [3, "Overall"]
      ],
      apiResponse: [
        ["Dakota Rice", "Niger"],
        ["Mason Porter", "Chile"]
      ]
    }

  testAPI = () => {
    getTestAPI()
      .then(res => res.json())
      .then(res => this.setState({ apiResponse: res }));
  }

  render() { 
      return (
        <div>
          <Dropdown 
            list={this.state.evaluationTypes} 
            name="Evaluation"
            onChange={this.changeEvaluation}
          />
          <Dropdown 
            list={this.state.evaluationTypes} 
            name="Evaluation"
            onChange={this.changeEvaluation}
          />
          <StickyHeadTable
            style={{ marginTop: 50}}
          />
        </div>
      )
  }

}

export default Compare;
