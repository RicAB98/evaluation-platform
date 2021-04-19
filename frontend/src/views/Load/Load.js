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
<<<<<<< HEAD
    period: null,
    date: null,
=======
>>>>>>> 0bbda8de16febbff758fe5b49124d9d96d8f299f
    popularQueries: 
    [{
      search_string: 'Loading...',
      n: 'Loading...'
    }],
    unsuccessfulQueries: 
    [{
      search_string: 'Loading...',
      n: 'Loading...'
    }],
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

    loadEvaluation(this.state.selectedEvaluation)
    .then(res => res.json())
    .then(res => (this.setState({ popularQueries: JSON.parse(res[0]["popular"]) }, 
                  this.setState({ unsuccessfulQueries: JSON.parse(res[0]["unsuccessful"]) }),  
                  this.setState({ period: res[0]["period"] }),  
                  this.setState({ date: new Date(res[0]["date"]) }),  
                  this.setState({ loaded: true }))))
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
          <div>
            <h3 style= {{ marginTop: 20}} >{this.state.date.getFullYear()}-{this.state.date.getMonth() + 1}-{this.state.date.getDate()} {this.state.date.getHours()}:{this.state.date.getMinutes()}:{this.state.date.getSeconds()}</h3>
            <h4 style= {{ marginTop: 10}} >{this.state.period}</h4>
            <div style= {{ display:"flex", 
            flexDirection: "row", 
            width: "75%", 
            justifyContent: "space-between",
            }}>
              <Table 
              tableTitle="Popular queries"
              tableHeaderColor="grey"
              tableHead={["#", "Query", "Occurrences", ' ']}
              tableData={this.state.popularQueries}
              />
              <Table 
              tableTitle="Unsuccessful queries"
              tableHeaderColor="grey"
              tableHead={["#", "Query", "Occurrences", ' ']}
              tableData={this.state.unsuccessfulQueries}
              />
            </div>
        </div> : null}
      </div>)
  }
}

export default Load;
