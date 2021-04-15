import * as React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Row, Col, Nav, NavItem } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import ReactPlayer from "react-player"

const arExample = require('../images/analysis_result_page.png');
const screenshotStyle = {
  width: '60%',
  border: '2px solid #888',
};


const DocsHowToDownloadData: React.FC = () => (
  <Row>
      <h2>How to Download Data From Pangea</h2>
      <br/>
      <br/>      
      <ReactPlayer
        url="https://youtu.be/IYAwWxDNxLs"
      />
      <br/>
      <br/>      
      <p>
          This guide will show you how to download data and metadata from Pangea.
          Data can be downloaded using the web app or using the 
          <a href='https://github.com/LongTailBio/pangea-django/tree/master/api-client'> CLI or Python API</a>.
          For bulk downloads the CLI is most convenient. 
      </p>

      <h3>Downloading data using the web app</h3>
      <img src={arExample} alt="Example Analysis Result Page" style={screenshotStyle} />
      <p>
        Downloading data using the web app is straightforward. First navigate to
        the Analysis Result you want to retrieve. Once on the page click on the
        fields that you want to download and a download should start automatically.

        Alternatively you can copy the URL that the field link points to and download
        that using a tool like <code>wget</code>
      </p>

      <h4>Downloading metadata using the web app</h4>
      <p>
        To download metadata with the web app first navigate to the
        Sample Group page with the samples you are interested in. Once on the page 
        click on the downloads tab then click on the link labeled 'Download Metadata as CSV'.

        Alternatively you can copy the URL that the csv link points to and download
        that using a tool like <code>wget</code>
      </p>

      <h3>Downloading data using the CLI</h3>
      <p>
        To download data using the CLI you will need the following
        <ul>
          <li>The name of the sample group you are interested in</li>
          <li>The name of the organization that sampl group is in</li>
          <li>The CLI installed on your machine <code>pip install pangea-api</code></li>
        </ul>

        You can use the CLI to fetch all results in a sample group or just some
        kinds of results.
        <br/>
        <br/>
        To download all data run the command:<br/>
        <code>{'pangea-api download sample-results <Org Name> <Group Name>'}</code>
        <br/>
        <br/>
        To download data from just one type of module run the command:<br/>
        <code>{'pangea-api download sample-results --module-name <Module Name> <Org Name> <Group Name>'}</code>
        <br/>
        <br/>
        For example to download all reads from
        <a href='https://pangeabio.io/sample-groups/15824754-8b3c-4033-8ba3-b153e77fa47f'> MetaSUB Doha </a>
        you would run the following:<br/>
        <code>{'pangea-api download sample-results --module-name "raw::raw_reads" "MetaSUB Consortium" "MetaSUB Doha"'}</code>
        <br/>
        <br/>
        The command line will only download one file at a time. Instead of downloading
        directly you can use the CLI to get a list of urls that you can download with a
        tool like <code>wget</code> by adding the <code>--urls-only</code> flag to your
        command. Example:<br/>
        <code>{'pangea-api download sample-results --urls-only --module-name "raw::raw_reads" "MetaSUB Consortium" "MetaSUB Doha"'}</code>
        <br/>
        <br/>
        For all options run: <code>{'pangea-api download sample-results --help'}</code>
      </p>

      <h4>Downloading metadata using the CLI</h4>
      <p>
        To download metadata using the CLI run: <code>{'pangea-api download metadata <Org Name> <Group Name>'}</code>
      </p>

      <h3>Downloading data using the Python API</h3>
      <p> 
        You can download data within python programs directly.

        See <a href='https://gist.github.com/dcdanko/c70304e5eb9c20fc81111929598edda0'> this </a> example for a
        simple approach or for more details see 
        <a href='https://github.com/LongTailBio/pangea-django/blob/master/api-client/pangea_api/cli/download.py'>
          the code for the command line
        </a>.
      </p>
  </Row>
);

export default DocsHowToDownloadData;