import * as React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Row, Col, Nav, NavItem } from 'react-bootstrap';
import { Helmet } from 'react-helmet';


const DocsDownloads: React.FC = () => (
  <Row>
      <h2>Downloading Data</h2>
      <p>
        Individual files may be downloaded from Pangea by clicking on the
        provided links. To find a file search for the relevant Sample or Sample
        Group, navigate to the result you want and click the name of the desired
        result.
      </p>
      <h3>Bulk Downloads</h3>
      <p>
        The best way to download a large number of files from Pangea is 
        to use the Python API which may be found
        <a href="https://github.com/LongTailBio/pangea-django/tree/master/api-client"> here.</a>
      </p>
      <hr/>
  </Row>
);

export default DocsDownloads;