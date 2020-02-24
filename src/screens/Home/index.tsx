import React from "react";
import { Link } from "react-router-dom";
import { Row, Col } from "react-bootstrap";

import { SearchBar } from "../../components/SearchBar";

export const HomeScreen = () => (
  <>
    <h1>Pangea</h1>
    <h3>A content management system for the Life Sciences</h3>

    <hr />

    <SearchBar />

    <hr />

    <Row>
      <Col lg={3} md={6}>
        <h4>Organizations</h4>
        <p>Browse data from Pangea Organizations.</p>
        <p>
          <Link to="/organizations" className="btn btn-primary">
            Organizations
          </Link>
        </p>
      </Col>
      <Col lg={3} md={6}>
        <h4>Taxa Search</h4>
        <p>Search samples by taxa</p>
        <p>
          <Link to="/contrib/taxa-search" className="btn btn-primary">
            Search
          </Link>
        </p>
      </Col>
      <Col lg={3} md={6} lgPush={3}>
        <h4>For Developers</h4>
        <p>Documentation and API.</p>
        <p>
          <Link to="/docs" className="btn btn-primary">
            API
          </Link>
        </p>
      </Col>
    </Row>
    <Row>
      <Col lg={3} md={6}>
        <h4>Sequence Search</h4>
        <p>Search DNA Sequences</p>
        <p>
          <a href="http://dnaloc.ethz.ch/" className="btn btn-primary">
            Search
          </a>
        </p>
      </Col>
      <Col lg={3} md={6}>
        <h4>Resistance Map</h4>
        <p>Map AMRs</p>
        <p>
          <a href="https://resistanceopen.org/" className="btn btn-primary">
            AMRs
          </a>
        </p>
      </Col>
    </Row>
  </>
);

export default HomeScreen;
