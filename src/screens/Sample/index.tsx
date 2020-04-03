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
} from 'react-bootstrap';
import { Helmet } from 'react-helmet';

import { usePangeaAxios, PaginatedResult } from '../../services/api';
import { SampleType } from '../../services/api/models/sample';
import { AnalysisResultType } from '../../services/api/models/analysisResult';

const useGroup = (uuid: string) => {
  const [sampleResult] = usePangeaAxios<SampleType>(`/samples/${uuid}`);
  const [analysisResultsResult] = usePangeaAxios<
    PaginatedResult<AnalysisResultType>
  >(`/sample_ars?sample_id=${uuid}`);

  const data = {
    sample: sampleResult.data,
    analysisResults: analysisResultsResult.data,
  };
  const loading = sampleResult.loading || analysisResultsResult.loading;
  const error = sampleResult.error || analysisResultsResult.error || undefined;
  return [{ data, loading, error }];
};

interface SampleScreenProps {
  uuid: string;
}

export const SampleScreen = (props: SampleScreenProps) => {
  const [{ data, loading, error }] = useGroup(props.uuid);

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Pangea :: Sample</title>
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
          <title>{`Pangea :: ${title}`}</title>
        </Helmet>
        <Row>
          <h1>{title}</h1>
          <h2>Sample</h2>
          <p>{error.message}</p>
        </Row>
      </>
    );
  }

  const { sample, analysisResults } = data;

  return (
    <>
      <Helmet>
        <title>{`Pangea :: ${sample.name}`}</title>
      </Helmet>
      <Row>
        <h1>{sample.name}</h1>
        <h2>Sample</h2>
      </Row>
      <Row>
        <Link to={`/sample-groups/${sample.library}`}>Library</Link>
      </Row>

      <Row>
        <Nav bsStyle="tabs" activeKey="1">
          <LinkContainer to={`/samples/${sample.uuid}`}>
            <NavItem eventKey="1">
              <Glyphicon glyph="folder-open" /> Analysis Results{' '}
              <Badge>{analysisResults.count}</Badge>
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
                {analysisResults.count > 0 &&
                  analysisResults.results.map(analysisResult => (
                    <ul
                      key={analysisResult.uuid}
                      className="analysis-group-list"
                    >
                      <li className="analysis-group-list-item">
                        <Link
                          to={`/samples/${sample.uuid}/analysis-results/${analysisResult.uuid}`}
                        >
                          {analysisResult.module_name} -{' '}
                          {analysisResult.replicate}
                        </Link>
                      </li>
                    </ul>
                  ))}
                {analysisResults.count === 0 && (
                  <Well className="text-center">
                    <h4>This sample has no analysis results.</h4>
                  </Well>
                )}
              </Col>
              <Col lg={6}>
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Feature</th>
                      <th scope="col">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(sample.metadata).map(key => (
                      <tr key={key}>
                        <th scope="row">{key}</th>
                        <td>{sample.metadata[key]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Col>
            </Row>
          )}
        />
      </Switch>
    </>
  );
};

export default SampleScreen;
