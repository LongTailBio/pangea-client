import * as React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Row, Col, Nav, NavItem } from 'react-bootstrap';
import { Helmet } from 'react-helmet';


const DocsApi: React.FC = () => (
  <Row>
      <h2 id='api'>The API</h2>
      <p>
        Pangea supports a RESTful API for users to interact with. This API may be
        used directly with tools like CURL or may be accessed through the officially
        support python library.
      </p>
      <h3>Swagger Documentation</h3>
      <p>
        Swagger documentation for the RESTful API may be found
        <a href="https://app.swaggerhub.com/apis/dcdanko/Pangea/beta"> here.</a>
      </p>
  </Row>
);

export default DocsApi;