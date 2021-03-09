import * as React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Helmet } from 'react-helmet';

import Team from './scenes/Team';

const content =
  'Pangea is a data platform designed for the way research happens. ' +
  'Modern biology comes with a deluge of data, Pangea can help you ' +
  'store, find, analyze, and share that data.';


const DocsAbout: React.FC = () => (
  <Row>
    <h1>About Pangea</h1>
    <h3>{content}</h3>
    <h3>Key Features of Pangea</h3>
    <h4> - Store and Index Petabytes of Data</h4>
    <h4> - Organize Research Projects and Streamline Analysis</h4>
    <h4> - Search, Visualize, and Compare Hundreds of Datasets</h4>
    <h4> - Open Source, Built with Academic Users in Mind</h4>   
    <hr />
    <br />
    <Team />
  </Row>
);

export default DocsAbout;
