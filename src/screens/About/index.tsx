import * as React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Helmet } from 'react-helmet';

import FAQ from './scenes/FAQ';
import Team from './scenes/Team';

const content =
  'The path from sequencing data to visualizations can be long ' +
  'and tedious. Researchers have to spend too much time running basic ' +
  'analyses and most tools rely on the command terminal. MetaGenScope ' +
  'takes the work out of routine analysis and serves a hub for ' +
  'metagenomics research. Researchers can use MetaGenScope to share data, ' +
  'share charts, and compare projects.';

class About extends React.Component {
  render() {
    return (
      <Row>
        <Helmet>
          <title>MetaGenScope :: About</title>
        </Helmet>
        <Col lg={10} lgOffset={1}>
          <h2>Built for Researchers</h2>
          <h3>
            Pangea is a data platform designed for the way research happens. Modern biology comes with a deluge of data, Pangea can help you store, find, analyze, and share that data.
          </h3>
          <h3>Key Features of Pangea</h3>
          <h4> - Store and Index Petabytes of Data</h4>
          <h4> - Organize Research Projects and Streamline Analysis</h4>
          <h4> - Search, Visualize, and Compare Hundreds of Datasets</h4>
          <h4> - Open Source, Built with Academic Users in Mind</h4>    
          <hr />    
          <h1>About</h1>
          <p>MetaGenScope automatically visualizes metagenomic data.</p>
          <p>{content}</p>
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
