import React, { useState, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { createAxios } from './services/api';

import DefaultLayout from './layouts/DefaultLayout';
import AuthForm from './screens/Auth/components/AuthForm';
import UserStatus from './screens/UserStatus';
import Logout from './screens/Auth/scenes/Logout';
import Home from './screens/Home';
import About from './screens/About';
import OrganizationList from './screens/OrganizationList';
import OrganizationDetail from './screens/OrganizationDetail';
import UserDetail from './screens/UserDetail';
import SampleGroup from './screens/SampleGroup';
import Sample from './screens/Sample';
import AnalysisResult from './screens/AnalysisResult';
import Dashboard from './screens/Dashboard';
import Docs from './screens/Docs';
import SearchResult from './screens/SearchResult';
import ContribRouter from './contrib/router';

export const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [title] = useState('Pangea');
  const [theme] = useState(undefined);

  useEffect(() => {
    if (window.localStorage.getItem('authToken')) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleOnLoginUser = (token: string) => {
    window.localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
  };

  const handleOnLogout = () => {
    createAxios()
      .post('/auth/token/logout/')
      .catch(err => {
        if (!(err.response && err.response.status === 403)) {
          throw err;
        }
      })
      .then(() => {
        window.localStorage.removeItem('authToken');
        setIsAuthenticated(false);
      });
  };

  return (
    <DefaultLayout
      isAuthenticated={isAuthenticated}
      title={title}
      theme={theme}
    >
      <Helmet>
        <meta charSet="utf-8" />
        <title>Pangea :: Home</title>
        <link rel="canonical" href="http://pangea.gimmebio.com/" />
      </Helmet>
      <Switch>
        <Route exact={true} path="/" component={Home} />
        <Route
          exact={true}
          path="/register"
          render={() => (
            <AuthForm
              formType={'register'}
              isAuthenticated={isAuthenticated}
              onLoginUser={handleOnLoginUser}
            />
          )}
        />
        <Route
          exact={true}
          path="/login"
          render={() => (
            <AuthForm
              formType={'login'}
              isAuthenticated={isAuthenticated}
              onLoginUser={handleOnLoginUser}
            />
          )}
        />
        <Route exact={true} path="/status" render={() => <UserStatus />} />
        <Route
          path="/dashboard"
          render={() => <Dashboard isAuthenticated={isAuthenticated} />}
        />
        <Route
          exact={true}
          path="/organizations"
          render={() => <OrganizationList />}
        />
        <Route
          path="/organizations/:uuid"
          render={routeProps => (
            <OrganizationDetail uuid={routeProps.match.params.uuid} />
          )}
        />
        <Route
          path="/users/:uuid"
          render={routeProps => (
            <UserDetail
              isAuthenticated={isAuthenticated}
              userUUID={routeProps.match.params.uuid}
            />
          )}
        />
        <Route
          exact={true}
          path="/sample-groups/:group_uuid/analysis-results/:uuid"
          render={routeProps => (
            <AnalysisResult
              uuid={routeProps.match.params.uuid}
              kind="sample-group"
            />
          )}
        />
        <Route
          path="/sample-groups/:uuid"
          render={routeProps => (
            <SampleGroup uuid={routeProps.match.params.uuid} />
          )}
        />
        <Route
          exact={true}
          path="/samples/:sample_uuid/analysis-results/:uuid"
          render={routeProps => (
            <AnalysisResult uuid={routeProps.match.params.uuid} kind="sample" />
          )}
        />
        <Route
          path="/samples/:uuid"
          render={routeProps => <Sample uuid={routeProps.match.params.uuid} />}
        />
        <Route
          path="/search/:query"
          render={routeProps => (
            <SearchResult query={routeProps.match.params.query} />
          )}
        />
        <Route
          exact={true}
          path="/logout"
          render={() => <Logout onLogoutUser={handleOnLogout} />}
        />
        <Route exact={true} path="/about" component={About} />
        <Route exact={true} path="/docs" component={Docs} />
        <Route path="/contrib" component={ContribRouter} />
      </Switch>
    </DefaultLayout>
  );
};

export default App;
