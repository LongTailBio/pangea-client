import * as React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Row, Col, Nav, NavItem } from 'react-bootstrap';
import { Helmet } from 'react-helmet';


const DocsMetagenscope: React.FC = () => (
  <Row>
      <h2>Visualization and MetaGenScope</h2>
      <p>
        Pangea supports data visualization through extension modules (see below). 
        MetaGenScope is a visualization module for Metagenomic data. To access 
        MetaGenScope for a Sample or Sample Group navigate to the appropriate
        page and click on the <i>Resources</i> tab. This tab contains a link
        to MetaGenScope.
      </p>
      <hr/>
  </Row>
);

export default DocsMetagenscope;