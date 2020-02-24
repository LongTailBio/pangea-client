import React from "react";
import { Switch, Route, RouteComponentProps } from "react-router-dom";

import TaxaSearch from "./taxa-search";

export const ContribRouter = (props: RouteComponentProps) => {
  const { path } = props.match;
  return (
    <Switch>
      <Route path={`${path}/taxa-search`} component={TaxaSearch} />
    </Switch>
  );
};

export default ContribRouter;
