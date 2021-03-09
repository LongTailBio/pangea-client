import * as React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Row, Col, Nav, NavItem } from 'react-bootstrap';
import { Helmet } from 'react-helmet';


const DocsPython: React.FC = () => (
  <Row>
      <h3>Python Library</h3>
      <p>
        Pangea includes an officially supported Python library to interact with the API.
      </p>
      <p>
        Source code and documentation for the Python library may be found
        <a href="https://github.com/LongTailBio/pangea-django/tree/master/api-client"> here.</a>
      </p>
      <hr/>
  </Row>
);

export default DocsPython;