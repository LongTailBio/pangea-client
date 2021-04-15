import * as React from 'react';
import { Switch, Route } from 'react-router';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import {
  Row,
  Col,
  Well,
  Nav,
  NavItem,
  Glyphicon,
  Badge,
} from 'react-bootstrap';
import { Helmet } from 'react-helmet';

import { usePangeaAxios, PaginatedResult, LinkList } from '../../services/api';
import { SampleGroupType } from '../../services/api/models/sampleGroup';
import { SampleLinkType } from '../../services/api/models/sample';
import { AnalysisResultType } from '../../services/api/models/analysisResult';
import MetaDataPanel from './components/MetaDataPanel';
import VizPanel from './components/VizPanel';
import AnalysisResultPanel from './components/AnalysisResultPanel';
import SampleListPanel from './components/SampleListPanel';
import DownloadPanel from './components/DownloadPanel';
import EditableDescription from './components/EditableDescription'
import EditableLongDescription from './components/EditableLongDescription'
import { HandleErrorLoading } from '../../components/ErrorLoadingHandler'
import SampleGroupSettings from './components/SampleGroupSettings'


const useSampleGroup = (uuid: string) => {
  const [sampleGroupResult] = usePangeaAxios<SampleGroupType>(
    `/sample_groups/${uuid}`,
  );
  const [samplesResult] = usePangeaAxios<LinkList<SampleLinkType>>(
    `/sample_groups/${uuid}/sample_links`,
  );
  const [analysisResultsResult] = usePangeaAxios<
    PaginatedResult<AnalysisResultType>
  >(`/sample_group_ars?sample_group_id=${uuid}`);

  const data = {
    group: sampleGroupResult.data,
    samples: samplesResult.data,
    analysisResults: analysisResultsResult.data,
  };
  const loading =
    sampleGroupResult.loading ||
    samplesResult.loading ||
    analysisResultsResult.loading;
  const error =
    sampleGroupResult.error ||
    samplesResult.error ||
    analysisResultsResult.error ||
    undefined;
  return [{ data, loading, error }];
};

interface SampleGroupScreenProps {
  uuid: string;
}

export const SampleGroupScreen = (props: SampleGroupScreenProps) => {
  const [{ data, loading, error }] = useSampleGroup(props.uuid);
  const { authToken } = window.localStorage;

  if(loading || error){
    return (<HandleErrorLoading loading={loading} error={error}/>)
  }

  const { group, samples, analysisResults } = data;
  let metadata_count = samples.count;
  return (
    <>
      <Helmet>
        <title>{`Pangea :: ${group.name}`}</title>
      </Helmet>
      <Row>
        <h1>{group.name}</h1>
        <h2>Sample Group</h2>
        <p>{group.is_public ? 'Public' : 'Private'}</p>
        <p>{new Date(group.created_at).toLocaleString()}</p>
        <Link to={`/organizations/${group.organization}`}>
          Owner Organization
        </Link>
        <EditableDescription group={group} />
      </Row>
      <br/>
      <Row>
        <EditableLongDescription group={group} />
      </Row>
      <hr/>

      <Row>
        <Nav bsStyle="tabs" activeKey="1">
          <LinkContainer to={`/sample-groups/${props.uuid}`} exact={true}>
            <NavItem eventKey="1">
              <Glyphicon glyph="star" /> Samples <Badge>{samples.count}</Badge>
            </NavItem>
          </LinkContainer>
          <LinkContainer to={`/sample-groups/${props.uuid}/analysis-results`}>
            <NavItem eventKey="2">
              <Glyphicon glyph="folder-open" /> Analysis Results{' '}
              <Badge>{analysisResults.count}</Badge>
            </NavItem>
          </LinkContainer>
          <LinkContainer to={`/sample-groups/${props.uuid}/metadata`}>
            <NavItem eventKey="3">
              <Glyphicon glyph="th-list" /> Metadata{' '}
              <Badge>{metadata_count}</Badge>
            </NavItem>
          </LinkContainer>
          <LinkContainer to={`/sample-groups/${props.uuid}/viz`}>
            <NavItem eventKey="4">
              <Glyphicon glyph="tags" /> Visualization{' '}
            </NavItem>
          </LinkContainer>
          <LinkContainer to={`/sample-groups/${props.uuid}/downloads`}>
            <NavItem eventKey="5">
              <Glyphicon glyph="download" /> Download{' '}
            </NavItem>
          </LinkContainer>
          <LinkContainer to={`/sample-groups/${props.uuid}/settings`}>
            <NavItem eventKey="6">
              <Glyphicon glyph="cog" /> Settings{' '}
            </NavItem>
          </LinkContainer>          
        </Nav>
      </Row>

      <br />
      <Switch>
        <Route
          exact={true}
          path="/sample-groups/:uuid"
          render={() => (
            <SampleListPanel samples={samples} grp={group} />
          )}
        />
        <Route
          exact={true}
          path="/sample-groups/:uuid/analysis-results"
          render={() => (
            <AnalysisResultPanel uuid={props.uuid} analysisResults={analysisResults.results} />
          )}
        />
        <Route
          exact={true}
          path="/sample-groups/:uuid/metadata"
          render={() => (
            <MetaDataPanel group={group} analysisResults={analysisResults.results} />
          )}
        />
        <Route
          exact={true}
          path="/sample-groups/:uuid/viz"
          render={() => (
            <VizPanel group={group} />
          )}
        />
        <Route
          exact={true}
          path="/sample-groups/:uuid/downloads"
          render={() => (
            <DownloadPanel group={group} analysisResults={analysisResults.results} />
          )}
        />
        SampleGroupSettings
        <Route
          exact={true}
          path="/sample-groups/:uuid/settings"
          render={() => (
            <SampleGroupSettings grp={group}/>
          )}
        />        
      </Switch>
    </>
  );
};

export default SampleGroupScreen;
