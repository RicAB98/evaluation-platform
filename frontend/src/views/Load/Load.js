import React, { Component } from "react";
import Dropdown from "../../components/Dropdown/Dropdown.js";
import Button from "../../components/Button/Button.js";
import Table from "../../components/Table/Table.js";
import TimelineIcon from "@material-ui/icons/Timeline";

import { loadEvaluation, getEvaluations } from "../../requests/requests.js";

class Load extends Component {
  state = {
    evaluations: [[1, "Loading evaluations..."]],
    selectedEvaluation:"",
    loaded: false,
    startDate: null,
    endDate: null,
    popularQueries: [
      {
        search_string: "Loading...",
        n: "Loading...",
      },
    ],
    unsuccessfulQueries: [
      {
        search_string: "Loading...",
        n: "Loading...",
      },
    ],
  };

  componentDidMount() {
    getEvaluations()
      .then((res) => res.json())
      .then((res) => this.setState({ evaluations: res }));

    let search = window.location.search;
    let params = new URLSearchParams(search);     

    let id = params.get("id");
    
    if (id !== null)
      this.setState({ selectedEvaluation: id }, () => this.loadEvaluation());     
  }

  changeEvaluation = (event) => {
    this.setState({ selectedEvaluation: event.target.value });
  };

  loadEvaluation = () => {

    this.props.history.push({
      pathname: "/admin/load",
      search: "?id=" + this.state.selectedEvaluation,
    });

    loadEvaluation(this.state.selectedEvaluation)
      .then((res) => res.json())
      .then((res) =>
        this.setState(
          { popularQueries: JSON.parse(res[0]["popular"]) },
          this.setState({
            unsuccessfulQueries: JSON.parse(res[0]["unsuccessful"]),
          }),
          this.setState({ startDate: new Date(res[0]["startDate"]) }),
          this.setState({ endDate: new Date(res[0]["endDate"]) }),
          this.setState({ loaded: true })
        )
      );
  };

  addOne(value) {
    return value + 1;
  }

  render() {
    return (
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: 300,
            justifyContent: "space-around",
          }}
        >
          <Dropdown
            list={this.state.evaluations}
            name="Evaluations"
            onChange={this.changeEvaluation}
          />
          <Button color="custom" onClick={() => this.loadEvaluation()}>
            Load
          </Button>
        </div>
        {this.state.loaded === true ? (
          <div style={{ marginLeft: 22 }}>
            <h3 style={{ marginTop: 20 }}>
              {this.state.startDate.getDate()}/
              {this.addOne(this.state.startDate.getMonth())}/
              {this.state.startDate.getFullYear()}{" "}
              {this.state.startDate.getHours()}:
              {this.state.startDate.getMinutes()}:
              {this.state.startDate.getSeconds()} -
            </h3>
            <h3 style={{ marginTop: 10 }}>
              {this.state.endDate.getDate()}/
              {this.addOne(this.state.endDate.getMonth())}/
              {this.state.endDate.getFullYear()} {this.state.endDate.getHours()}
              :{this.state.endDate.getMinutes()}:
              {this.state.endDate.getSeconds()}
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                width: "75%",
                justifyContent: "space-between",
              }}
            >
              <Table
                tableTitle="Popular queries"
                tableHeaderColor="gray"
                tableHead={["#", "Query", "Occurrences", " "]}
                tableData={this.state.popularQueries}
                firstColumn={["search_string"]}
                secondColumn={["n"]}
                localLinkPath="/admin/query?"
                localLinkIcon={<TimelineIcon />}
                externalLink={false}
              />
              <Table
                tableTitle="Unsuccessful queries"
                tableHeaderColor="gray"
                tableHead={["#", "Query", "Occurrences", " "]}
                tableData={this.state.unsuccessfulQueries}
                firstColumn={["search_string"]}
                secondColumn={["n"]}
                localLinkPath="/admin/query?"
                localLinkIcon={<TimelineIcon />}
                externalLink={false}
              />
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default Load;
