import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';

import { SearchBar } from '../../components/SearchBar';

export const HomeScreen = () => (
  <>
    
    <Row>
      <Col lg={8}>
        <h1>Pangea</h1>
        <h3>A content management system for the Life Sciences</h3>

        <SearchBar />

        <hr />
        <h2>Built for Researchers</h2>
        <h3>
          Pangea is a data platform designed for the way research happens. Modern biology comes with a deluge of data, Pangea can help you store, find, analyze, and share that data.
        </h3>
        <h3>Key Features of Pangea</h3>
        <h4> - Store and Index Petabytes of Data</h4>
        <h4> - Organize Research Projects and Streamline Analysis</h4>
        <h4> - Search, Visualize, and Compare Hundreds of Datasets</h4>
        <h4> - Open Source, Built with Academic Users in Mind</h4>
        <Link to="/register" className="btn btn-primary">
          Register Now
        </Link> 
      </Col>
      <Col lg={1}>
      </Col>
      <Col lg={3}>
        <Row>
          <h4>Organizations</h4>
          <p>Browse data from Pangea Organizations.</p>
          <p>
            <Link to="/organizations" className="btn btn-primary">
              Organizations
            </Link>
          </p>
        </Row>
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

export default HomeScreen;
