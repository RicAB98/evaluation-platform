import React from 'react';
import { Helmet } from 'react-helmet';

import ReactDOM from 'react-dom';
import './index.css';
import Admin from "./layouts/Admin.js";
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";

const hist = createBrowserHistory();

ReactDOM.render(
  <div>
  <Helmet>
        <title>Evaluation platform</title>
  </Helmet>
  <Router history={hist}>
    <Switch>
      <Route path="/admin" component={Admin} />
      <Redirect from="/" to="/admin/trending" />
    </Switch>
  </Router>
  </div>,
    document.getElementById("root")

);

reportWebVitals();
