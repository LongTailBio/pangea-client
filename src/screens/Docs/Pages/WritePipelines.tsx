import * as React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Row, Col, Nav, NavItem } from 'react-bootstrap';
import { Helmet } from 'react-helmet';


const DocsWritePipelines: React.FC = () => (
  <Row>
      <h2>Writing Pipelines Using Pangea</h2>
      <p>
        You can use Pangea's APIs to directly process data with Bioinformatic pipelines.
        Roughly, this process works by downloading data, processing it through your
        pipeline and uploading the results. This is sometimes called an Extract Transform Load
        or ETL pipeline.

        There are several example pipelines you can start from.
      </p>
      <h3>Simple Python Example</h3>
      <p>
        Pangea can be used as part of a simple python program which may in turn call other programs.

        <a href="https://github.com/LongTailBio/pangea-django/tree/feat/auth-and-management/api-client/examples/simple_python_example"> Example Code</a>
      </p>

      <h3>Simple Snakemake Example</h3>
      <p>
        Pangea can be used with <a href='https://snakemake.github.io/'> Snakemake</a> a popular pipelining tool.

        <a href="https://github.com/LongTailBio/pangea-django/tree/feat/auth-and-management/api-client/examples/simple_snakemake_example"> Example Code</a>
      </p>

      <h3>A Complex Pipeline Based on Luigi</h3>
      <p>
        The <a href='https://github.com/MetaSUB/CAP2'>MetaSUB Core Analysis Pipeline</a> is an open source pipeline for analyzing metagenomic data.
        The CAP is based on <a href='https://github.com/spotify/luigi'>Luigi</a> and <a href='https://github.com/MetaSUB/CAP2/tree/master/cap2/pangea'>integrated with Pangea</a>. The CAP can be
        run both locally without Pangea or off of a Pangea server.
      </p>
  </Row>
);

export default DocsWritePipelines;