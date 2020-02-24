import React from "react";
import { Switch, Route, RouteComponentProps } from "react-router-dom";

export const TaxaSearch = (props: RouteComponentProps) => {
  const { path } = props.match;
  return (
    <Switch>
      <Route path={path} exact={true}>
        <p>Hello Taxa Search</p>
      </Route>
    </Switch>
  );
};

export default TaxaSearch;
