import * as React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { default as axios, CancelTokenSource } from 'axios';

import { usePangeaAxios } from '../../../../../../services/api';
import { SampleGroupType } from '../../../../../../services/api/models/sampleGroup';

import { SampleSimilarityModule } from '../../../../display_modules/SampleSimilarity';


interface MGSSampleGroupScreenProps {
  groupID: string;
  updateTheme?(theme?: string): void;
}


export const MGSSampleGroupScreen = (props: MGSSampleGroupScreenProps) => {
    const [{ data, loading, error }] = usePangeaAxios<SampleGroupType>(
      `/sample_groups/${props.groupID}`,
    );

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Pangea :: MGS :: Sample Group</title>
        </Helmet>
        <Row>
          <h1>Loading...</h1>
          <h2>Sample Group</h2>
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
          <h2>Sample Group</h2>
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
          <p>{data.description}</p>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col lg={12}>
          <SampleSimilarityModule orgID={data.organization} groupID={props.groupID} />
        </Col>
      </Row>
    </div>
  )
}

export default MGSSampleGroupScreen;
