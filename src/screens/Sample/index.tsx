import * as React from 'react';
import { Link } from 'react-router-dom';
import { Switch, Route } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import {
  Row,
  Col,
  Well,
  Nav,
  NavItem,
  Glyphicon,
  Badge,
  Collapse,
  Button,
  Panel,
} from 'react-bootstrap';
import { Helmet } from 'react-helmet';

import { usePangeaAxios, PaginatedResult } from '../../services/api';
import { SampleType } from '../../services/api/models/sample';
import { TagType } from '../../services/api/models/tag';
import { AnalysisResultType } from '../../services/api/models/analysisResult';
import { HandleErrorLoading } from '../../components/ErrorLoadingHandler'

import SampleMetadataPanel from './components/SampleMetadataPanel';
import EditableDescription from './components/EditableDescription';
import SampleSettings from './components/SampleSettings';



const useGroup = (uuid: string) => {
  const [sampleResult] = usePangeaAxios<SampleType>(`/samples/${uuid}`);
  const [tagResult] = usePangeaAxios<PaginatedResult<TagType>>(`/contrib/tags?sample=${uuid}`);
  const [analysisResultsResult] = usePangeaAxios<
    PaginatedResult<AnalysisResultType>
  >(`/sample_ars?sample_id=${uuid}`);

  const data = {
    sample: sampleResult.data,
    analysisResults: analysisResultsResult.data,
    tags: tagResult.data,
  };
  const loading = sampleResult.loading || analysisResultsResult.loading || tagResult.loading;
  const error = sampleResult.error || analysisResultsResult.error || tagResult.error || undefined;
  return [{ data, loading, error }];
};

interface SampleScreenProps {
  uuid: string;
}

const arHtml = (analysisResult: AnalysisResultType, uuid: string) => {

  return (
    <ul
      key={analysisResult.uuid}
      className="analysis-group-list"
    >
      <li className="analysis-group-list-item">
        <Link
          to={`/samples/${uuid}/analysis-results/${analysisResult.uuid}`}
        >
          {analysisResult.module_name} -{' '}
          {analysisResult.replicate}
        </Link>
        {analysisResult.description && (
          <>
            <br/>
            <p>{analysisResult.description}</p>
          </>)}                  
      </li>
    </ul>
  )
}


const arList = (analysisResults: AnalysisResultType[], uuid: string) => {
  if(analysisResults.length === 0) {
    return (<></>)
  }
  return (
    <>
      {analysisResults.map(aR => arHtml(aR, uuid))}
    </>
  )
}

export const SampleScreen = (props: SampleScreenProps) => {
  const [open, setOpen] = React.useState(false);
  const [{ data, loading, error }] = useGroup(props.uuid);

  if(loading || error){
    return (<HandleErrorLoading loading={loading} error={error}/>)
  }

  const { sample, analysisResults, tags } = data;
  const linkToCreateAr = {
    pathname: `/samples/${sample.uuid}/create-analysis-results`,
    state: {
      sample: sample,
    }
  }
  const shownResults = analysisResults.results.filter(ar => !ar.is_hidden);
  const hiddenResults = analysisResults.results.filter(ar => ar.is_hidden);
  return (
    <>
      <Helmet>
        <title>{`Pangea :: ${sample.name}`}</title>
      </Helmet>
      <Row>
        <h1>{sample.name}</h1>
        <h2>Sample</h2>
        <Link to={`/sample-groups/${sample.library}`}>Library</Link>
      </Row>
      <br/>
      <Row>
        <EditableDescription sample={sample} />
      </Row>
      <hr/>
      <Row>
        <Nav bsStyle="tabs" activeKey="1">
          <LinkContainer to={`/samples/${sample.uuid}`}>
            <NavItem eventKey="1">
              <Glyphicon glyph="folder-open" /> Analysis Results{' '}
              <Badge>{analysisResults.count}</Badge>
            </NavItem>
          </LinkContainer>
          <LinkContainer to={`/samples/${sample.uuid}/resources`}>
            <NavItem eventKey="2">
              <Glyphicon glyph="th-large" /> Resources{' '}
            </NavItem>
          </LinkContainer>
          <LinkContainer to={`/samples/${sample.uuid}/settings`}>
            <NavItem eventKey="2">
              <Glyphicon glyph="cog" />{' '}Settings{' '}
            </NavItem>
          </LinkContainer>                      
        </Nav>
      </Row>

      <br />

      <Switch>
        <Route
          exact={true}
          path="/samples/:uuid"
          render={() => (
            <Row>
              <Col lg={6}>
                {arList(shownResults, props.uuid)}
                
                { hiddenResults.length > 0 && (
                  <>
                    <hr/>
                    <Button
                      onClick={() => setOpen(!open)}
                      aria-controls="example-collapse-text"
                      aria-expanded={open}
                    >
                      {open ? "Hide Hidden Results" : "Show Hidden Results"}
                    </Button>
                    <br/>
                    <Collapse in={open}>
                      <Panel>
                      {arList(hiddenResults, props.uuid)}
                      </Panel>
                    </Collapse>
                  </>
                )}
                <br/>
                {analysisResults.count === 0 && (
                  <Well className="text-center">
                    <h4>This sample has no analysis results.</h4>
                  </Well>
                )}
                <Link to={linkToCreateAr} className="btn btn-primary">
                  Create Analysis Result
                </Link>
              </Col>
              <Col lg={6}>
                <SampleMetadataPanel sample={sample} />
              </Col>
            </Row>
          )}
        />
        <Route
          exact={true}
          path="/samples/:uuid/resources"
          render={() => (
            <Row>
              <Col lg={12}>
                <ul key="get-manifest" className="analysis-group-list">
                  <li className="analysis-group-list-item">
                    <a
                      href={`/api/samples/${sample.uuid}/manifest?format=json`}
                    >
                      Data Manifest - A file describing this sample and
                      everything in it
                    </a>
                  </li>
                  <li className="analysis-group-list-item">
                    <Link to={`/contrib/metagenscope/samples/${sample.uuid}`}>
                      MetaGenScope - Automated Data Visualization
                    </Link>
                  </li>
                </ul>
              </Col>
            </Row>
          )}
        />
        <Route
          exact={true}
          path="/samples/:uuid/settings"
          render={() => (
            <SampleSettings sample={sample} tags={tags} />           
          )}
        />        
      </Switch>
    </>
  );
};

export default SampleScreen;
