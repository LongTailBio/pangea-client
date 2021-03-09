import * as React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Row, Col, Nav, NavItem } from 'react-bootstrap';
import { Helmet } from 'react-helmet';


const DocsMetagenscope: React.FC = () => (
  <Row>
      <h1>A Content Management System for the Life Sciences</h1>
      <p>
        Pangea is a Content Mangement System designed specifically for the Life
        Sciences. It is designed to help researchers manage projects, track data
        and metadata, and to find new interesting patterns in their data. Pangea
        integrates cloud storage services (like Amazon S3) with High Performance
        Compute Systems to allow researchers to manage and process their data
        across its full lifecycle.
      </p>
      <p>
        <b>Pangea Key Features</b>
        <ul>
          <li>Organize Biological Data and Projects</li>
          <li>Low Cost Storage of Petabytes of Data</li>
          <li>Search, Visualize, and Compare Datasets</li>
        </ul>
      </p>
      <p>
        At its core Pangea employs a simple flexible data model which can
        support a wide variety of project types. Individual samples contain both
        raw data and analyses. Samples can be grouped together to form Sample
        Groups which may also contain data and analyses relevant to all the
        samples together. Organizations control samples and groups and Users may
        belong to organizations. More detail on this data model may be found
        below.
      </p>
      <hr/>
      <h2>Guides</h2>
        <ul>
          <li><a href='/docs/how-to-upload-reads'>Uploading Reads to Pangea</a></li>
          <li><a href='/docs/write-pipelines'>Writing Pipelines with Pangea</a></li>
        </ul>
      <h2>Support</h2>
      <p>
        Please feel free to email dev@longtailbio.com for questions and help.
      </p>
      <hr/>




  </Row>
);

export default DocsMetagenscope;