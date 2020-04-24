import React from 'react';
import { Switch, Route, RouteComponentProps } from 'react-router-dom';

import TaxaSearch from './taxa-search';
import Covid19 from './covid19';
import MetasubMap from './metasub';
import MGSSampleGroupScreen from './metagenscope/screens/SampleGroups/scenes/GroupDetail'

export const ContribRouter = (props: RouteComponentProps) => {
  const { path } = props.match;
  return (
    <Switch>
      <Route path={`${path}/taxa-search`} component={TaxaSearch} />
      <Route path={`${path}/covid-19`} component={Covid19} />
      <Route path={`${path}/metasub`} component={MetasubMap} />
      <Route
          path={`${path}/metagenscope/sample_group/:groupID`}
          render={routeProps => <MGSSampleGroupScreen groupID={routeProps.match.params.groupID} />}
        />
    </Switch>
  );
};

export default ContribRouter;
