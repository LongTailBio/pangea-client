import * as React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Row, Col, Nav, NavItem } from 'react-bootstrap';
import { Helmet } from 'react-helmet';


const DocsSearch: React.FC = () => (
  <Row>
      <h2>Search</h2>
      <p>
        Pangea includes a powerful set of search tools for biological data. Users can search by keyword,
        DNA sequence, taxon name, and by metadata features. Use the "random" search button to see some
        example searches.
      </p>
      <hr/>
  </Row>
);

export default DocsSearch;