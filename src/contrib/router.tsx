import React from 'react';
import { Switch, Route, RouteComponentProps } from 'react-router-dom';

import TaxaSearch from './taxa-search';
import Covid19 from './covid19';
import MGSSampleGroupScreen from './metagenscope/screens/SampleGroups/scenes/GroupDetail';
import MGSSampleScreen from './metagenscope/screens/Samples/scenes/SampleDetail';
import MetasubMap from './metasub';
import TaxonScreen from './treeoflife/screens/Taxon';

export const ContribRouter = (props: RouteComponentProps) => {
  const { path } = props.match;
  return (
    <Switch>
      <Route path={`${path}/taxa-search`} component={TaxaSearch} />
      <Route path={`${path}/covid-19`} component={Covid19} />
      <Route
        path={`${path}/metagenscope/sample-groups/:groupID`}
        render={routeProps => (
          <MGSSampleGroupScreen groupID={routeProps.match.params.groupID} />
        )}
      />
      <Route
        path={`${path}/metagenscope/samples/:sampleID`}
        render={routeProps => (
          <MGSSampleScreen sampleID={routeProps.match.params.sampleID} />
        )}
      />
      <Route path={`${path}/metasub`} component={MetasubMap} />
      <Route
        path={`${path}/treeoflife/:taxon`}
        render={routeProps => (
          <TaxonScreen taxon={routeProps.match.params.taxon} />
        )}
      />
    </Switch>
  );
};

export default ContribRouter;
