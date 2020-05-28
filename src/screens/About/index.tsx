import * as React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Helmet } from 'react-helmet';

import FAQ from './scenes/FAQ';
import Team from './scenes/Team';

const content =
  'Pangea is a data platform designed for the way research happens. ' +
  'Modern biology comes with a deluge of data, Pangea can help you ' +
  'store, find, analyze, and share that data.';

class About extends React.Component {
  render() {
    return (
      <Row>
        <Helmet>
          <title>Pangea :: About</title>
        </Helmet>
        <Col lg={10} lgOffset={1}>
          <h1>About Pangea</h1>
          <h3>{content}</h3>
          <h3>Key Features of Pangea</h3>
          <h4> - Store and Index Petabytes of Data</h4>
          <h4> - Organize Research Projects and Streamline Analysis</h4>
          <h4> - Search, Visualize, and Compare Hundreds of Datasets</h4>
          <h4> - Open Source, Built with Academic Users in Mind</h4>   
          <hr />
          <br />
          <FAQ />
          <hr />
          <br />
          <Team />
        </Col>
      </Row>
    );
  }
}

export default About;
