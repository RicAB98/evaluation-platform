import React, {Component} from "react";
// core components

import Button from "../../components/Button/Button.js";
import LineChart from "../../components/Chart/LineChart";
import { queryEvolution} from "../../requests/requests.js";

class QueryPerformance extends Component {
 
  state = {
      startDate: new Date('2021-01-29'),
      endDate: null,
      showChart: false,
      data:    
      [
        {
          "id": "loading",
          "color": "hsl(0, 70%, 50%)",
          "data": 
          [
            {
              "x": "20-01",
              "y": 0
            }
          ]
        }
    ],
      name: this.props.location.state != null ? this.props.location.state.string: '',
    }

    componentDidMount()
    {
      if(this.state.name != '')
        this.submitEvaluation();
    }

    changeValue = (event) => {
        this.setState({ name: event.target.value});
    };

    submitEvaluation = () => {
   
        this.setState({ showChart: true});
        
        queryEvolution(this.state.name)
        .then(res => res.json())
        .then(res => this.setState({ data: res}))
      };

  render() { 
      return (
           
        <div style= {{ display:"flex", 
            flexDirection: "column",
            }}>  
            <label style={{ marginLeft: 8 }}>
                Query:
                <input 
                value={this.state.name} 
                onChange={this.changeValue}
                type="text"
                style={{ marginLeft: 8 }}
                />
            </label>
            <Button
                color="custom"
                onClick={() => this.submitEvaluation()}
                style={{ width: 100}}
            >
                Submit
            </Button> 
            { this.state.showChart == true ?    
            <LineChart
                data={this.state.data}
            /> : null}
        </div>
      )
  }

}

export default QueryPerformance;
