import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import DefaultLayout from './layouts/DefaultLayout';
import AuthForm from './screens/Auth/components/AuthForm';
import UserStatus from './screens/UserStatus';
import Logout from './screens/Auth/scenes/Logout';
import Home from './screens/Home';
import About from './screens/About';
import Organizations from './screens/Organizations';
import SampleGroups from './screens/SampleGroups';
import Samples from './screens/Samples';
import Dashboard from './screens/Dashboard';
import Docs from './screens/Docs';

interface AppState {
  username: string;
  email: string;
  title: string;
  isAuthenticated: boolean;
  theme?: string;
}

class App extends React.Component<{}, AppState> {

  constructor(props: {}) {
    super(props);

    this.state = {
      username: '',
      email: '',
      title: 'MetaGenScope',
      isAuthenticated: false,
      theme: undefined,
    };

    this.updateTheme = this.updateTheme.bind(this);
  }

  componentWillMount() {
    if (window.localStorage.getItem('authToken')) {
      this.setState({ isAuthenticated: true });
    }
  }

  loginUser(token: string) {
    window.localStorage.setItem('authToken', token);
    this.setState({ isAuthenticated: true });
  }

  logoutUser() {
    window.localStorage.clear();
    this.setState({ isAuthenticated: false });
  }

  updateTheme(theme?: string) {
    this.setState({theme});
  }

  render() {
    return (
      <DefaultLayout {...this.state}>
        <Helmet>
          <meta charSet="utf-8" />
          <title>MetaGenScope :: Home</title>
          <link rel="canonical" href="http://metagenscope.com/" />
        </Helmet>
        <Switch>
          <Route exact={true} path="/" component={Home} />
          <Route
            exact={true}
            path="/register"
            render={() => (
              <AuthForm
                formType={'register'}
                isAuthenticated={this.state.isAuthenticated}
                loginUser={this.loginUser.bind(this)}
              />
            )}
          />
          <Route
            exact={true}
            path="/login"
            render={() => (
              <AuthForm
                formType={'login'}
                isAuthenticated={this.state.isAuthenticated}
                loginUser={this.loginUser.bind(this)}
              />
            )}
          />
          <Route
            exact={true}
            path="/status"
            render={() => (
              <UserStatus
                isAuthenticated={this.state.isAuthenticated}
              />
            )}
          />
          <Route
            path="/dashboard"
            render={() => (
              <Dashboard
                isAuthenticated={this.state.isAuthenticated}
              />
            )}
          />
          <Route
            path="/organizations"
            render={() => (
              <Organizations
                isAuthenticated={this.state.isAuthenticated}
              />
            )}
          />
          <Route
            path="/sample-groups"
            render={() => (
              <SampleGroups
                isAuthenticated={this.state.isAuthenticated}
                updateTheme={this.updateTheme}
              />
            )}
          />
          <Route
            path="/samples"
            render={() => (
              <Samples
                isAuthenticated={this.state.isAuthenticated}
                updateTheme={this.updateTheme}
              />
            )}
          />
          <Route
            exact={true}
            path="/logout"
            render={() => (
              <Logout
                logoutUser={this.logoutUser.bind(this)}
                isAuthenticated={this.state.isAuthenticated}
              />
            )}
          />
          <Route exact={true} path="/about" component={About} />
          <Route exact={true} path="/docs" component={Docs} />
        </Switch>
      </DefaultLayout>
    );
  }
}

export default App;
