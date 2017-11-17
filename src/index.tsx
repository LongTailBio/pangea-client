import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

// import App from './App';
import About from './components/About';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

ReactDOM.render(
  (
  <Router>
    <About />
  </Router>
  ),
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
