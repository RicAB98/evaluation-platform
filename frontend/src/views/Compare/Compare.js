import React, { Component } from "react";
// core components
import Button from "../../components/Button/Button.js";
import Dropdown from "../../components/Dropdown/Dropdown.js";
import StickyHeadTable from "../../components/StickyHeadTable/StickyHeadTable.js";

//import { getEvaluations } from "../../requests/requests.js";

class Compare extends Component {
  state = {
    evaluations: [[1, "Loading evaluations..."]],
    apiResponse: [
      ["Dakota Rice", "Niger"],
      ["Mason Porter", "Chile"],
    ],
  };

  componentDidMount() {
    getEvaluations()
      .then((res) => res.json())
      .then((res) => this.setState({ evaluations: res }));
  }

  render() {
    return (
      <div>
        <Dropdown
          list={this.state.evaluations}
          name="Evaluation"
          onChange={this.changeEvaluation}
        />
        <Dropdown
          list={this.state.evaluations}
          name="Evaluation"
          onChange={this.changeEvaluation}
        />
        <Button
          color="custom"
          onClick={() => this.submitEvaluation()}
          style={{ marginBottom: 50 }}
        >
          Run
        </Button>
        <StickyHeadTable />
      </div>
    );
  }
}

export default Compare;
