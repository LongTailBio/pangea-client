import * as React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { default as axios, CancelTokenSource } from 'axios';

import { usePangeaAxios } from '../../../../../../services/api';
import { SampleType } from '../../../../../../services/api/models/sample';

import { SampleTaxonomyModule } from     '../../../../display_modules/SampleTaxonomy';
import { ReadsClassifiedModule } from     '../../../../display_modules/ReadsClassified';
import { MicrobeDirectoryModule } from     '../../../../display_modules/MicrobeDirectory';


interface MGSSampleScreenProps {
  sampleID: string;
  updateTheme?(theme?: string): void;
}


export const MGSSampleScreen = (props: MGSSampleScreenProps) => {
    const [{ data, loading, error }] = usePangeaAxios<SampleType>(
      `/samples/${props.sampleID}`,
    );

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Pangea :: MGS :: Sample</title>
        </Helmet>
        <Row>
          <h1>Loading...</h1>
          <h2>Sample</h2>
        </Row>
      </>
    );
  }

  if (error) {
    const { status } = error.response || {};
    const title = status === 404 ? 'Not Found' : 'Error';
    return (
      <>
        <Helmet>
          <title>{`Pangea :: MGS :: ${title}`}</title>
        </Helmet>
        <Row>
          <h1>{title}</h1>
          <h2>Sample</h2>
          <p>{error.message}</p>
        </Row>
      </>
    );
  }

  return (
    <div>
      <Helmet>
        <title>MetaGenScope :: {data.name}</title>
      </Helmet>
      <Row>
        <Col lg={12}>
          <h1>{data.name}</h1>
          <Link to={`/samples/${props.sampleID}`}>
            Sample Page
          </Link>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col lg={12}>
          <SampleTaxonomyModule orgID={data.library_obj.organization} groupID={data.library} sampleID={props.sampleID} />
          <ReadsClassifiedModule orgID={data.library_obj.organization} groupID={data.library} sampleID={props.sampleID} isSingleton={true} />      
          <MicrobeDirectoryModule orgID={data.library_obj.organization} groupID={data.library} sampleID={props.sampleID} isSingleton={true} />
        </Col>
      </Row>
    </div>
  )
}

export default MGSSampleScreen;
