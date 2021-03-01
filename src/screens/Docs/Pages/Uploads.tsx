import * as React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Row, Col, Nav, NavItem } from 'react-bootstrap';
import { Helmet } from 'react-helmet';


const DocsUploads: React.FC = () => (
  <Row>
      <h2>Uploading Data</h2>
      <p>
       Currently uploading data requires some experience with the command line. To upload data
       you should use the python API, found <a href="https://github.com/LongTailBio/pangea-django/tree/master/api-client"> here.</a>
       If your data is large you will need to upload it to S3 or another cloud storage provider
       before uploading to Pangea.
      </p>
      <hr/>
  </Row>
);

export default DocsUploads;