import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router";

import App from "./App";
import { unregister } from "./registerServiceWorker";
import { history } from "./history";
import "./utils";
import "./index.css";

ReactDOM.render(
  <Router history={history}>
    <App />
  </Router>,
  document.getElementById("root") as HTMLElement
);
unregister();
