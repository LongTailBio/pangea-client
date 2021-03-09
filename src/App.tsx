import React, { useState, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { createAxios } from './services/api';

import DefaultLayout from './layouts/DefaultLayout';
import AuthForm from './screens/Auth/components/AuthForm';
import UserStatus from './screens/UserStatus';
import Logout from './screens/Auth/scenes/Logout';
import Home from './screens/Home';
import TagList from './screens/TagList';
import TagDetail from './screens/TagDetail';
import OrganizationList from './screens/OrganizationList';
import OrganizationCreate from './screens/OrganizationCreate';
import OrganizationDetail from './screens/OrganizationDetail';
import UserDetail from './screens/UserDetail';
import SampleGroup from './screens/SampleGroup';
import CreateGrpFormPage from './screens/SampleGroupCreate';
import CreateSampleFormPage from './screens/SampleCreate';
import Sample from './screens/Sample';
import AnalysisResult from './screens/AnalysisResult';
import Dashboard from './screens/Dashboard';
import Docs from './screens/Docs';
import SearchResult from './screens/SearchResult';
import OmniSearchResult from './screens/OmniSearchResult';
import ContribRouter from './contrib/router';
import ToolsScreen from './screens/Tools';
import PipelineList from './screens/PipelineList';
import PipelineDetail from './screens/PipelineDetail';
import PipelineModuleScreen from './screens/PipelineModule';
import CreateAnalysisResultFormPage from './screens/AnalysisResultCreate';

import { PangeaUserType } from './services/api/models/user';
import { usePangeaAxios } from './services/api';
import {useUserContext} from './components/UserContext'

export const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [title] = useState('Pangea');
  const [theme] = useState(undefined);
  
  const {handleFetchUserProfile} = useUserContext();
  const [{ data, loading, error }] = usePangeaAxios<PangeaUserType>(`/users/me`);
  
  useEffect(() => {
    handleFetchUserProfile(data);
  }, [handleFetchUserProfile, data])

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
        <Route
          path="/comingsoon"
          render={() => (<h1>Coming Soon!</h1>)}
        />
        <Route
          exact={true}
          path="/tools"
          render={() => <ToolsScreen />}
        />
        <Route
          exact={true}
          path="/tags"
          render={() => <TagList />}
        />
        <Route
          exact={true}
          path="/tags/:uuid"
          render={routeProps => (
            <TagDetail uuid={routeProps.match.params.uuid} />
          )}
        />            
        <Route
          exact={true}
          path="/organizations"
          render={() => <OrganizationList />}
        />
        <Route
          path="/organizations/create"
          render={routeProps => (
            <OrganizationCreate isAuthenticated={isAuthenticated} />
          )}
        />
        <Route
          exact={true}
          path="/pipelines"
          render={() => <PipelineList />}
        />
        <Route
          path="/pipelines/:uuid"
          render={routeProps => (
            <PipelineDetail uuid={routeProps.match.params.uuid} />
          )}
        />
        <Route
          path="/pipeline-modules/:uuid"
          render={routeProps => (
            <PipelineModuleScreen uuid={routeProps.match.params.uuid} />
          )}
        />         
        <Route
          path="/organizations/:uuid"
          render={routeProps => (
            <OrganizationDetail uuid={routeProps.match.params.uuid} />
          )}
        />
        <Route
          path="/users/me"
          render={routeProps => (
            <UserDetail
              isAuthenticated={isAuthenticated}
            />
          )}
        />
        <Route
          path="/users/:uuid"
          render={routeProps => (
            <UserDetail
              isAuthenticated={isAuthenticated}
              isDjoserId={false}
              id={routeProps.match.params.uuid}
            />
          )}
        />
        <Route
          path="/users-id/:id"
          render={routeProps => (
            <UserDetail
              isAuthenticated={isAuthenticated}
              isDjoserId={true}
              id={routeProps.match.params.id}
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
          path="/sample-groups/create"
          render={routeProps => (
            <CreateGrpFormPage isAuthenticated={isAuthenticated} />
          )}
        />
        <Route
          path="/sample-groups/:uuid/create-sample"
          render={routeProps => (
            <CreateSampleFormPage
              isAuthenticated={isAuthenticated}
              libraryUUID={routeProps.match.params.uuid}
            />
          )}
        />
        <Route
          exact={true}
          path="/sample-groups/:uuid/create-analysis-results"
          render={routeProps => (
            <CreateAnalysisResultFormPage
              isAuthenticated={isAuthenticated}
              sampleUUID={routeProps.match.params.uuid}
              kind={"sample-group"}
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
          exact={true}
          path="/samples/:uuid/create-analysis-results"
          render={routeProps => (
            <CreateAnalysisResultFormPage
              isAuthenticated={isAuthenticated}
              sampleUUID={routeProps.match.params.uuid}
              kind={"sample"}
            />
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
          path="/omnisearch/:query"
          render={routeProps => (
            <OmniSearchResult query={routeProps.match.params.query} />
          )}
        />
        <Route
          exact={true}
          path="/logout"
          render={() => <Logout onLogoutUser={handleOnLogout} />}
        />
        <Route path="/docs" component={Docs} />
        <Route path="/contrib" component={ContribRouter} />
      </Switch>
    </DefaultLayout>
  );
};

export default App;
