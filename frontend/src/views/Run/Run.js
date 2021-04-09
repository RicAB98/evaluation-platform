import React, {Component} from "react";
import Dropdown from "../../components/Dropdown/Dropdown.js";
import Button from "../../components/Button/Button.js";

import { runEvaluation } from "../../requests/requests.js";

class Run extends Component {
  state = {
    evaluationTypes: [
      [1, "Least successful"],
      [2, "Most searched"],
      [3, "Overall"]
    ],
    periodTypes: [
      [1, "Last day"],
      [2, "Last week"],
      [3, "Last month"]
    ],
    name: '',
    selectedEvaluation: null,
    selectedPeriod: null,
  }

  changeValue = (event) => {
    this.setState({ name: event.target.value});
  };

  changeEvaluation = (event) => {
    this.setState({ selectedEvaluation: event.target.value});
  };

  changePeriod = (event) => {
    this.setState({ selectedPeriod: event.target.value});
  };

  submitEvaluation = () => {
    const formData = new FormData();

    let evaluationType = this.state.evaluationTypes[this.state.selectedEvaluation - 1]
    let period = this.state.periodTypes[this.state.selectedPeriod - 1]
    let name = this.state.name

    runEvaluation(name, evaluationType, period)
    .then(res => res.text())
    .then(res => console.log(res))
  };

  render() {
    return (
    <div>
      <label style={{ marginLeft: 8 }}>
        Name:
        <input 
          defaultValue="Default"
          value={this.state.name} 
          onChange={this.changeValue}
          type="text"
          style={{ marginLeft: 8 }}
        />
      </label>
      <Dropdown 
        list={this.state.evaluationTypes} 
        name="Type"
        onChange={this.changeEvaluation}
      />
      <Dropdown 
        list={this.state.periodTypes} 
        name="Period"
        onChange={this.changePeriod}
      />
      <Button
        color="custom"
        onClick={() => this.submitEvaluation()}
      >
        Run
      </Button>
    </div>)
  }
}

export default Run;
