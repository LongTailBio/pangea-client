import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import AnalysisGroupDetail from './scenes/GroupDetail';

interface PersonRowProps {
  isAuthenticated: boolean;
  updateTheme?(theme?: string): void;
}


const SampleGroups: React.SFC<PersonRowProps> = (props) => {
  return (
    <Switch>
      <Route
        path="/sample-groups/:uuid"
        render={(routeProps) => (
          <AnalysisGroupDetail
            groupID={routeProps.match.params.uuid}
            updateTheme={props.updateTheme}
          />
        )}
      />
    </Switch>
  );
};

export default SampleGroups;
