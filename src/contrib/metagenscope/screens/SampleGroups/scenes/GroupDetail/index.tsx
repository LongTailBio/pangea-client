import * as React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { Helmet } from 'react-helmet';

import {
  usePangeaAxios,
  PaginatedResult,
} from '../../../../../../services/api';
import { SampleGroupType } from '../../../../../../services/api/models/sampleGroup';
import { SampleType } from '../../../../../../services/api/models/sample';
import SampleList from './components/SampleList';

import { SampleSimilarityModule } from '../../../../display_modules/SampleSimilarity';
import { TopTaxaModule } from '../../../../display_modules/TopTaxa';
import { AGSModule } from '../../../../display_modules/AverageGenomeSize';
import { AlphaDiversityModule } from '../../../../display_modules/AlphaDiversity';
import { CovidDisplayModule } from '../../../../display_modules/CovidDisplay';
import { MultiAxisModule } from '../../../../display_modules/MultiAxis';
import { VolcanoModule } from '../../../../display_modules/Volcano';
import { ReadsClassifiedModule } from '../../../../display_modules/ReadsClassified';
import { MicrobeDirectoryModule } from '../../../../display_modules/MicrobeDirectory';

interface MGSSampleGroupScreenProps {
  groupID: string;
  updateTheme?(theme?: string): void;
}

const useSampleGroup = (uuid: string) => {
  const [sampleGroupResult] = usePangeaAxios<SampleGroupType>(
    `/sample_groups/${uuid}`,
  );
  const [samplesResult] = usePangeaAxios<PaginatedResult<SampleType>>(
    `/sample_groups/${uuid}/samples`,
  );

  const data = {
    group: sampleGroupResult.data,
    samples: samplesResult.data,
  };
  const loading = sampleGroupResult.loading || samplesResult.loading;
  const error = sampleGroupResult.error || samplesResult.error || undefined;
  return [{ data, loading, error }];
};

export const MGSSampleGroupScreen = (props: MGSSampleGroupScreenProps) => {
  const [{ data, loading, error }] = useSampleGroup(props.groupID);

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

  const grp: SampleGroupType = data.group;
  const samples: SampleType[] = data.samples.results;
  console.log(data.samples);
  return (
    <div>
      <Helmet>
        <title>MetaGenScope :: {grp.name}</title>
      </Helmet>
      <Row>
        <Col lg={12}>
          <h1>
            <Link to={`/sample-groups/${props.groupID}`}>{grp.name}</Link>
          </h1>
          <p>{grp.description}</p>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col lg={12}>
          <SampleSimilarityModule
            orgID={grp.organization}
            groupID={props.groupID}
          />
          <CovidDisplayModule
            orgID={grp.organization}
            groupID={props.groupID}
          />
          <ReadsClassifiedModule
            orgID={grp.organization}
            groupID={props.groupID}
          />
          <VolcanoModule orgID={grp.organization} groupID={props.groupID} />
          <TopTaxaModule orgID={grp.organization} groupID={props.groupID} />
          <AlphaDiversityModule
            orgID={grp.organization}
            groupID={props.groupID}
          />
          <MultiAxisModule orgID={grp.organization} groupID={props.groupID} />
          <MicrobeDirectoryModule
            orgID={grp.organization}
            groupID={props.groupID}
          />
          <AGSModule orgID={grp.organization} groupID={props.groupID} />
        </Col>
      </Row>
      <hr />
      <Row>
        <Col lg={12}>
          <SampleList samples={samples} />
        </Col>
      </Row>
    </div>
  );
};

export default MGSSampleGroupScreen;
