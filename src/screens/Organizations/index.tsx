import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import OrganizationsList from './scenes/OrganizationsList';
import OrganizationDetail from './scenes/OrganizationDetail';
import CreateOrganization from './scenes/CreateOrganization';

interface OrganizationsProps {
  isAuthenticated: boolean;
}

const Organizations: React.SFC<OrganizationsProps> = (props) => {
  return (
    <Switch>
      <Route exact={true} path="/organizations" component={OrganizationsList} />
      <Route
        exact={true}
        path="/organizations/new"
        render={(routeProps) => (
          <CreateOrganization {...props} />
        )}
      />
      <Route
        path="/organizations/:uuid"
        render={(routeProps) => (
          <OrganizationDetail uuid={routeProps.match.params.uuid} />
        )}
      />
    </Switch>
  );
};

export default Organizations;
