import * as React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Helmet } from 'react-helmet';

const dataModel = require('./images/pangea_data_model.jpg');
const pipelineStyle = {
  width: '100%',
};

class Docs extends React.Component {
  render() {
    return (
      <Row>
        <Helmet>
          <title>Pangea :: Documenation</title>
        </Helmet>
        <Col lg={10} lgOffset={1}>
          <h1>A Content Management System for the Life Sciences</h1>
          <p>
            Pangea is a Content Mangement System designed specifically for the
            Life Sciences. It is designed to help researchers manage projects,
            track data and metadata, and to find new interesting patterns in
            their data. Pangea integrates cloud storage services (like Amazon
            S3) with High Performance Compute Systems to allow researchers to
            manage and process their data across its full lifecycle.
          </p>
          <p>
            At its core Pangea employs a simple flexible data model which can
            support a wide variety of project types. Individual samples contain
            both raw data and analyses. Samples can be grouped together to form
            Sample Groups which may also contain data and analyses relevant to
            all the samples together. Organizations control samples and groups
            and Users may belong to organizations. More detail on this data
            model may be found below.
          </p>
          <p>
            In addition to its core functionalty Pangea supports a system of
            extension modules. These extension modules may be used to support a
            wide variety of additional use cases. Critically, extension modules
            can support search and visualization of data.
          </p>

          <h3>The Data Model</h3>
          <p>
            Pangea employs a simple data model that can support a variety of use
            cases. The core of this data model is a Sample. Samples represent a
            singular physical object like a biopsy or swab. Samples contain
            metadata which records details that researchers deem important for
            their experiments, common examples include date of collection,
            processing technician, and more.
          </p>
          <img src={dataModel} alt="Pangea data model" style={pipelineStyle} />
          <p>
            To group samples into projects Pangea supports Sample-Groups.
            Sample-Groups are quite literally just groups of samples. Samples
            may belong to many different groups to support different analyses
            and sub-group analyses with the only restrictions being related to
            privacy. The only exception to this are Sample Libraries (often
            called just Libraries in our documentation). Sample Libraries are
            also Sample Groups but have a special property that every sample
            must belong to exactly one Sample Library. This library is, in
            effect, the sample's home-base.
          </p>
          <p>
            The real strength of Pangea is its ability to connect data and
            analyses to samples. Samples contain Analysis-Results which
            represent either raw data from the sample or results derived from
            analysis of that data. An example of this could be the raw reads
            from paired-end DNA sequencing of a sample. The raw reads would be
            stored as an Analysis-Result with two Analysis-Result-Fields, one
            each for the forward and reverse reads. Each Field could point to a
            file stored on the cloud or, for results that require less storage,
            be stored directly in Pangea.
          </p>
          <p>
            Sample-Groups may also contain Analysis-Results. In this case
            Analysis-Results are used to represent anything that applies to all
            the samples at once. An example would be a pairwise distance matrix
            between all samples in a dataset.
          </p>
          <p>
            Analysis-Results may contain multiple replicates of the same type
            and each Analysis-Result may contain a list of the other
            Analysis-Results it was derived from. This helps to ensure
            provenance of each result and reproducible research.
          </p>
        </Col>
      </Row>
    );
  }
}

export default Docs;
