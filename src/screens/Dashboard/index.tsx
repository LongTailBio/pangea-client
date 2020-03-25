import * as React from 'react';
import { Route, Switch, Link } from 'react-router-dom';

import DashboardLanding from './scenes/DashboardLanding';

interface DashboardProps {
  isAuthenticated: boolean;
}

class Dashboard extends React.Component<DashboardProps, {}> {
  render() {
    if (!this.props.isAuthenticated) {
      return (
        <p>
          You must be logged in to view this. Click{' '}
          <Link to="/login">here</Link> to log back in.
        </p>
      );
    }
    return (
      <Switch>
        <Route exact={true} path="/dashboard" component={DashboardLanding} />
      </Switch>
    );
  }
}

export default Dashboard;
