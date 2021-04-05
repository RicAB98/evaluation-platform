import React, {Component} from "react";
// core components
import Button from "@material-ui/core/Button";
import Table from "../../components/Table/Table.js";
import { getTestAPI } from "../../requests/requests.js";

class Result extends Component {
  state = {
      counters: [
         {id: 1, value: 4},
         {id: 2, value: 0},
         {id: 3, value: 0},
         {id: 4, value: 0},
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
          <Button
                  color="secondary"
                  onClick={() => this.testAPI()}
                >
                  GET from API
                </Button>
          <Table 
          tableHeaderColor="grey"
          tableHead={["Query", "Percentage"]}
          tableData={this.state.apiResponse}
             />
        </div>
      )
  }

}

export default Result;
