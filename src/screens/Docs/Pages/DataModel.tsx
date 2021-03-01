import * as React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Row, Col, Nav, NavItem } from 'react-bootstrap';
import { Helmet } from 'react-helmet';

const dataModel = require('../images/pangea_data_model.jpg');
const pipelineStyle = {
  width: '100%',
};


const DocsDataModel: React.FC = () => (
  <Row>
      <h2 id='datamodel'>The Data Model</h2>
      <p>
        Pangea employs a simple data model that can support a variety of use
        cases. The core of this data model is a Sample. Samples represent a
        singular physical object like a biopsy or swab. Samples contain metadata
        which records details that researchers deem important for their
        experiments, common examples include date of collection, processing
        technician, and more.
      </p>
      <img src={dataModel} alt="Pangea data model" style={pipelineStyle} />
      <p>
        To group samples into projects Pangea supports Sample-Groups.
        Sample-Groups are quite literally just groups of samples. Samples may
        belong to many different groups to support different analyses and
        sub-group analyses with the only restrictions being related to privacy.
        The only exception to this are Sample Libraries (often called just
        Libraries in our documentation). Sample Libraries are also Sample Groups
        but have a special property that every sample must belong to exactly one
        Sample Library. This library is, in effect, the sample&apos;s home-base.
      </p>
      <p>
        The real strength of Pangea is its ability to connect data and analyses
        to samples. Samples contain Analysis-Results which represent either raw
        data from the sample or results derived from analysis of that data. An
        example of this could be the raw reads from paired-end DNA sequencing of
        a sample. The raw reads would be stored as an Analysis-Result with two
        Analysis-Result-Fields, one each for the forward and reverse reads. Each
        Field could point to a file stored on the cloud or, for results that
        require less storage, be stored directly in Pangea.
      </p>
      <p>
        Sample-Groups may also contain Analysis-Results. In this case
        Analysis-Results are used to represent anything that applies to all the
        samples at once. An example would be a pairwise distance matrix between
        all samples in a dataset.
      </p>
      <p>
        Analysis-Results may contain multiple replicates of the same type and
        each Analysis-Result may contain a list of the other Analysis-Results it
        was derived from. This helps to ensure provenance of each result and
        reproducible research.
      </p>
      <hr/>
  </Row>
);

export default DocsDataModel;