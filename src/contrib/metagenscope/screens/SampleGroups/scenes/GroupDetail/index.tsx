import * as React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { default as axios, CancelTokenSource } from 'axios';

import { usePangeaAxios } from '../../../../../../services/api';
import { SampleGroupType } from '../../../../../../services/api/models/sampleGroup';

import { SampleSimilarityModule } from '../../../../display_modules/SampleSimilarity';
import { TopTaxaModule } from '../../../../display_modules/TopTaxa';
import { AGSModule } from     '../../../../display_modules/AverageGenomeSize';
import { AlphaDiversityModule } from     '../../../../display_modules/AlphaDiversity';
import { MultiAxisModule } from     '../../../../display_modules/MultiAxis';
import { VolcanoModule } from     '../../../../display_modules/Volcano';
import { MicrobeDirectoryModule } from     '../../../../display_modules/MicrobeDirectory';

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
          <VolcanoModule orgID={data.organization} groupID={props.groupID} />
          <TopTaxaModule orgID={data.organization} groupID={props.groupID} />
          <AlphaDiversityModule orgID={data.organization} groupID={props.groupID} />
          <MultiAxisModule orgID={data.organization} groupID={props.groupID} />
          <MicrobeDirectoryModule orgID={data.organization} groupID={props.groupID} />
          <AGSModule orgID={data.organization} groupID={props.groupID} />
        </Col>
      </Row>
    </div>
  )
}

export default MGSSampleGroupScreen;