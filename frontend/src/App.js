import React from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { createBrowserHistory } from "history";
import Admin from "./layouts/Admin.js";

// template css, keep this
import "./assets/css/material-dashboard-react.css";
import Dashboard from "./views/Dashboard/Dashboard.js";

const hist = createBrowserHistory();

function App() {
  return (
    <Router history={hist}>
      <Switch>
        <Route path="/admin" render={() => { 
          if(localStorage.getItem('userType') === '') return <Redirect to="/dashboard"/>; 
          else return <Admin/>; 
        }}/>
        <Route path="/dashboard" component={Dashboard} />
        {/* <Route path="/login" component={Login} /> */}
        <Redirect from="/" to="/dashboard" />
      </Switch>
    </Router>
  );
}

export default App;
