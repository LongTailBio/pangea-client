import React from "react";
import ReactDOM from "react-dom";
import { Router, Route } from "react-router";
import { QueryParamProvider } from "use-query-params";

import App from "./App";
import { unregister } from "./registerServiceWorker";
import { history } from "./history";
import "./utils";
import "./index.css";

ReactDOM.render(
  <Router history={history}>
    <QueryParamProvider ReactRouterRoute={Route}>
      <App />
    </QueryParamProvider>
  </Router>,
  document.getElementById("root") as HTMLElement
);
unregister();
