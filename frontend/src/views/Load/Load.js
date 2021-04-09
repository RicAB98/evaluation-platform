import React, {Component} from "react";
import Dropdown from "../../components/Dropdown/Dropdown.js";
import Button from "../../components/Button/Button.js";
import Table from "../../components/Table/Table.js";

import { loadEvaluation, getEvaluations } from "../../requests/requests.js";

class Load extends Component {
  state = {
    evaluations: [
      [1, "Loading evaluations..."]
    ],
    selectedEvaluation: null,
    loaded: false,
    loadedEvaluation: [
      ["Loading..", "Loading.."]
    ]
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

    loadEvaluation(this.state.selectedEvaluation)
    .then(res => res.json())
    .then(res => 
      this.setState({ loadedEvaluation: res }), 
      this.setState({ loaded: true }))
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
        {this.state.loaded == true ? 
          <Table 
          tableHeaderColor="warning"
          tableHead={["Query", "Percentage"]}
          tableData={this.state.loadedEvaluation}
            />
        : null}
      </div>)
  }
}

export default Load;
