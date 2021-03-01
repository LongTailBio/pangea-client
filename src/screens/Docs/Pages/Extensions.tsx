import * as React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Row, Col, Nav, NavItem } from 'react-bootstrap';
import { Helmet } from 'react-helmet';


const DocsExtensions: React.FC = () => (
  <Row>
      <h2>Extension Modules</h2>
      <p>
        In addition to its core functionalty Pangea supports a system of
        extension modules. These extension modules may be used to support a wide
        variety of additional use cases. Critically, extension modules can
        support search and visualization of data.
      </p>
  </Row>
);

export default DocsExtensions;