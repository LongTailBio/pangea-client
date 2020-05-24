import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';


export const ToolsScreen = () => (
  <>
    
    <Row>
      <Col lg={5}>
        <Row>
          <h4>MetaSUB</h4>
          <p>See a map of microbes around the world</p>
          <p>
            <Link to="/contrib/metasub" className="btn btn-primary">
              Search
            </Link>
          </p>
        </Row>
        <Row>
          <h4>COVID-19</h4>
          <p>Find COVID-19 in Samples</p>
          <p>
            <Link to="/contrib/covid-19" className="btn btn-primary">
              Search
            </Link>
          </p>
        </Row>
      </Col>
      <Col lg={5}>
        <Row>
          <h4>Sequence Search</h4>
          <p>Search DNA Sequences</p>
          <p>
            <a href="http://dnaloc.ethz.ch/" className="btn btn-primary">
              Search
            </a>
          </p>
        </Row>
        <Row>
          <h4>Resistance Map</h4>
          <p>Map Anitmicrobial Resistance</p>
          <p>
            <a href="https://resistanceopen.org/" className="btn btn-primary">
              AMRs
            </a>
          </p>
        </Row>
      </Col>
    </Row>
  </>
);

export default ToolsScreen;