import React, {Component} from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Button from "@material-ui/core/Button";
import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import Table from "../../components/Table/Table.js";
import Card from "../../components/Card/Card.js";
import CardHeader from "../../components/Card/CardHeader.js";
import CardBody from "../../components/Card/CardBody.js";
import { getTestAPI } from "../../requests/requests.js";

class Result extends Component {
  state = {
      counters: [
         {id: 1, value: 4},
         {id: 2, value: 0},
         {id: 3, value: 0},
         {id: 4, value: 0},
      ],
      apiResponse: " wait"
    }

  componentDidMount()
  {
    //this.testAPI()
  }

  testAPI = () => {
    getTestAPI()
      .then(res => res.text())
      .then(res => this.setState({ apiResponse: res }));
  }

  render() { 
      return (
        <div>
          <Button
                  fullWidth
                  color="secondary"
                  //onClick={() => testAPI()}
                >
                  {this.state.apiResponse}
                </Button>
          <Table tableData = {this.state.counters} buttonName = {this.state.apiResponse} />
        </div>
      )
      /*return (<div>
          {this.state.counters.map(counter => 
          <Counter onDelete={this.handleDelete} key = {counter.id} id = {counter.id} value={counter.value}>
          </Counter>
          )}
      </div>);*/
  }

  handleDelete = (counterId) => {
      console.log(counterId)
      const counters = this.state.counters.filter(c => c.id !== counterId);
      this.setState({counters})
  }
}

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  }
};

const useStyles = makeStyles(styles);



export default Result;

/*export default function TableList() {
  const classes = useStyles();
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="info">
            <h4 className={classes.cardTitleWhite}>Results</h4>
          </CardHeader>
          <CardBody>
            <Table
              tableHeaderColor="primary"
              tableHead={["Name", "Country", "City", "Salary"]}
              tableData={[
                ["Dakota Rice", "Niger", "Oud-Turnhout", "$36,738"],
                ["Minerva Hooper", "Curaçao", "Sinaai-Waas", "$23,789"],
                ["Sage Rodriguez", "Netherlands", "Baileux", "$56,142"],
                ["Philip Chaney", "Korea, South", "Overland Park", "$38,735"],
                ["Doris Greene", "Malawi", "Feldkirchen in Kärnten", "$63,542"],
                ["Mason Porter", "Chile", "Gloucester", "$78,615"]
              ]}
            />
          </CardBody>
        </Card>
      </GridItem>
     
    </GridContainer>
  );
}
*/