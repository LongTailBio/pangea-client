import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';
import { QueryParamProvider } from 'use-query-params';

import App from './App';
import { unregister } from './registerServiceWorker';
import { history } from './history';
import './utils';
import './index.css';
import {UserContextProvider} from './components/UserContext'

ReactDOM.render(
  <Router history={history}>
    <UserContextProvider>
        <QueryParamProvider ReactRouterRoute={Route}>
          <App />
        </QueryParamProvider>
    </UserContextProvider>
  </Router>,
  document.getElementById('root') as HTMLElement,
);
unregister();
