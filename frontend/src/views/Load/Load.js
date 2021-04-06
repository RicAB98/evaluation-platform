import React, {Component} from "react";
import Dropdown from "../../components/Dropdown/Dropdown.js";
import Button from "../../components/Button/Button.js";

import { getEvaluations } from "../../requests/requests.js";

class Load extends Component {
  state = {
    evaluations: [
      [1, "First"],
      [2, "Second"],
      [3, "Third"]
    ],
    selectedEvaluation: null
  }

  componentDidMount()
  {
    getEvaluations()
    .then(res => res.json())
    .then(res => this.setState({ evaluations: res }))
  }

  changeEvaluation = (event) => {
    this.setState({ selectedEvaluation: event.target.value});
  };

  loadEvaluation = () => {
    const formData = new FormData();

    console.log(this.state.selectedEvaluation)

    /*loadEvaluation(selectedEvaluation)
    .then(res => res.text())
    .then(res => console.log(res))*/
  };

  render() {
    return (
      <div>
        <Dropdown 
        list={this.state.evaluations} 
        name="Evaluations"
        onChange={this.changeEvaluation}
      />
        <Button
        color="custom"
        onClick={() => this.loadEvaluation()}
      >
        Load
      </Button>
      </div>)
  }
}

export default Load;
