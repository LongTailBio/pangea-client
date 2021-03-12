import * as React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Row, Col, Nav, NavItem } from 'react-bootstrap';
import { Helmet } from 'react-helmet';

const whereIsLoginButton = require('../images/find_login.png');
const screenshotStyle = {
  width: '60%',
  border: '2px solid #888',
};


const DocsUploadMetadata: React.FC = () => (
  <Row>
      <h2 id='datamodel'>How To Upload Metadata to Pangea</h2>
     
      <p>
        This guide will show you how to upload metadata to samples on Pangea.
        It assumes you already have created samples, you can find a guide to 
        creating samples <a href='/docs/how-to-upload-reads'>here</a>.
      </p>
      <p>
        Metadata is information about how a sample was collected, processed,
        handled, etc. Since samples are data metadata is literally data about
        data. Sometimes, particularly in statistical settings, metadata is
        called 'covariates'.
      </p>
      <h3>Preparing a metadata spreadsheet</h3>
      <br/>
      <p>
        To upload metadata you will need to organize it into a metadata sheet.
        A metadata sheet is a Character Separated Value file (typically
        comma delimited). This type of file can be opened in programs like Excel
        or exported from a Excel sheet or Google Docs sheet.
      </p>
      <p>
        The metadata sheet must be structured a particular way. The first column in
        the sheet should contain sample names and there should be exactly one blank
        at the top of the sheet.  The sample names must be exactly the same as the
        sample names on Pangea. Each metadata variable (e.g. 'collection latitude')
        should have its own column. The name of the variable will go in the first
        row of the column and each value will go in the row with the matching sample
        name. You can download an example of such a file
        <a href='https://pangeabio.io/sample-groups/188ecbc3-c332-4177-8050-a1637ff4e4b4/metadata'> here</a>.
      </p>
      <p>
        If some of your samples do not have values for certain metadata variables
        these can be left blank. There is no need to add an explicit filler value
        like 'n/a'.
      </p>

      <h3>Uploading metadata using the CLI</h3>
      <br/>
      <p>
        Once you have your metadata sheet as a CSV file you can upload it to Pangea using
        the command line.
        <br/>
        First install the CLI, by running <code>pip install pangea_api</code> then run the following command:
        <br/>
        <code>{'pangea-api upload metadata -e <email> -p <password> <organization name> <sample library name> <metadata file>' }</code>
        <br/>
        By default this command will not overwrite metadata for any samples that already have metadata.
        If you want to overwrite metadata add <code>--overwrite</code> to the above command. Note that
        metadata on Pangea is versioned, it is possible to retrieve metadata even if it has been
        overwritten.
      </p>
  </Row>
);

export default DocsUploadMetadata;